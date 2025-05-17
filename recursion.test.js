import { assertEquals, fail } from "jsr:@std/assert";

Deno.test("Recursion", async (t) => {
  await t.step({
    name: "find the nth Fibonacci number",
    fn: () => {
      const fibonacci = (n) => {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
      };

      const generalResult = fibonacci(5);
      const zeroResult = fibonacci(0);
      const oneResult = fibonacci(1);
      assertEquals(generalResult, 5);
      assertEquals(zeroResult, 0);
      assertEquals(oneResult, 1);
    },
  });

  await t.step({
    name: "reverse capitalize a string",
    fn: () => {
      const reverseCapitalize = (str) => {
        const helper = (index) => {
          if (index < 0) return "";
          const char = str[index];
          const transformed = char === char.toUpperCase()
            ? char.toLowerCase()
            : char.toUpperCase();
          return transformed + helper(index - 1);
        };
        return helper(str.length - 1);
      };

      const generalResult = reverseCapitalize("BetTeR SafE ThaN SoRry");
      const emptyStringResult = reverseCapitalize("");
      assertEquals(generalResult, "YRrOs nAHt eFAs rEtTEb");
      assertEquals(emptyStringResult, "");
    },
  });

  await t.step({
    name: "find the maximum value in a list",
    fn: () => {
      function max(arr) {
        if (arr.length === 0) return -Infinity;
        if (arr.length === 1) return arr[0];
        const restMax = max(arr.slice(1));
        return arr[0] > restMax ? arr[0] : restMax;
      }

      const maxOfEmptyList = max([]);
      const maxOfSingletonList = max([2]);
      const maxOfList = max([2, 3, 1, 4]);

      assertEquals(maxOfEmptyList, -Infinity);
      assertEquals(maxOfSingletonList, 2);
      assertEquals(maxOfList, 4);
    },
  });

  await t.step({
    name: "remove substrings from a string",
    fn: () => {
      function strip(str, substr) {
        if (!substr) return str;
        const index = str.indexOf(substr);
        if (index === -1) return str;
        return strip(
          str.slice(0, index) + str.slice(index + substr.length),
          substr,
        );
      }

      const generalResult = strip("Skies are grey in Greece", "re");
      const emptyStringResult = strip("", "re");
      const emptySubstringResult = strip("Skies are grey in Greece", "");
      assertEquals(generalResult, "Skies a gy in Gece");
      assertEquals(emptySubstringResult, "Skies are grey in Greece");
      assertEquals(emptyStringResult, "");
    },
  });

  await t.step({
    name: "flatten a nested array",
    fn: () => {
      function flatten(arr) {
        return arr.reduce(
          (acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val),
          [],
        );
      }

      const generalResult = flatten([1, [2, 3], [4, [5]]]);
      const emptyArrayResult = flatten([]);
      assertEquals(generalResult, [1, 2, 3, 4, 5]);
      assertEquals(emptyArrayResult, []);
    },
  });
});
