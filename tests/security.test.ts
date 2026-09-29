import { describe, expect, it } from "vitest";
import { CALCULATOR_ENGINES } from "@/components/calculators/engines";
import { CALCULATORS } from "@/lib/registry";
import { searchCalculators } from "@/lib/search";
import { validateFields } from "@/lib/utils/validate";
import nextConfig from "@/next.config";

describe("security headers", () => {
  async function headersForAllRoutes() {
    const routes = await nextConfig.headers!();
    expect(routes).toHaveLength(1);
    expect(routes[0].source).toBe("/(.*)");
    return Object.fromEntries(
      routes[0].headers.map((h) => [h.key, h.value]),
    );
  }

  it("keeps X-Powered-By disabled", () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });

  it("serves a least-permissive CSP with frame protection", async () => {
    const headers = await headersForAllRoutes();
    const csp = headers["Content-Security-Policy"];
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("img-src 'self'");
    expect(csp).toContain("font-src 'self'");
    // Test runs without NODE_ENV=development: production must never allow eval.
    expect(csp).not.toContain("unsafe-eval");
    // No third-party origins: the app loads nothing external.
    expect(csp).not.toMatch(/https?:\/\//);
  });

  it("sets the standard hardening headers", async () => {
    const headers = await headersForAllRoutes();
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["Strict-Transport-Security"]).toContain("max-age=");
    const pp = headers["Permissions-Policy"];
    expect(pp).toContain("camera=()");
    expect(pp).toContain("microphone=()");
    expect(pp).toContain("geolocation=()");
  });
});

describe("search safety", () => {
  const hostile = [
    ".*",
    ".*.*.*.*.*.*.*",
    "((((",
    "a+b{2,}",
    "[a-z]+",
    "\\",
    "$^",
    "***",
    "<script>alert(1)</script>",
    "'; DROP TABLE calculators; --",
    "💥".repeat(50),
    "a".repeat(10_000),
    "((.*)){20}".repeat(100),
    "\u0000\u0001\u0002",
  ];

  it("never throws on regex metacharacters or hostile input", () => {
    for (const q of hostile) {
      expect(() => searchCalculators(q)).not.toThrow();
    }
  });

  it("only ever returns registry entries, within the limit", () => {
    const valid = new Set(CALCULATORS.map((c) => c.slug));
    for (const q of hostile) {
      const results = searchCalculators(q);
      expect(results.length).toBeLessThanOrEqual(8);
      for (const r of results) expect(valid.has(r.slug)).toBe(true);
    }
  });

  it("still finds calculators for normal queries", () => {
    expect(searchCalculators("sss contribution").length).toBeGreaterThan(0);
  });
});

describe("input hardening", () => {
  it("rejects extreme magnitudes in every number field", () => {
    for (const meta of CALCULATORS) {
      const calc = CALCULATOR_ENGINES[meta.slug];
      const base = Object.fromEntries(
        calc.fields.map((def) => [
          def.name,
          def.defaultValue !== undefined ? String(def.defaultValue) : "",
        ]),
      );
      for (const def of calc.fields) {
        if (def.kind !== "number") continue;
        const raw = { ...base };
        if (def.showIf) raw[def.showIf.name] = def.showIf.equals;
        raw[def.name] = "999999999999999999";
        const result = validateFields(calc.fields, raw);
        expect(
          result.ok,
          `${meta.slug}.${def.name} accepted an extreme value`,
        ).toBe(false);
      }
    }
  });

  it("rejects non-finite notation before it reaches an engine", () => {
    for (const meta of CALCULATORS) {
      const calc = CALCULATOR_ENGINES[meta.slug];
      const base = Object.fromEntries(
        calc.fields.map((def) => [
          def.name,
          def.defaultValue !== undefined ? String(def.defaultValue) : "",
        ]),
      );
      for (const def of calc.fields) {
        if (def.kind !== "number") continue;
        const raw = { ...base };
        if (def.showIf) raw[def.showIf.name] = def.showIf.equals;
        raw[def.name] = "1e999";
        const result = validateFields(calc.fields, raw);
        expect(
          result.ok,
          `${meta.slug}.${def.name} accepted Infinity notation`,
        ).toBe(false);
      }
    }
  });
});
