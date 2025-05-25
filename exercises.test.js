import { assertEquals } from "jsr:@std/assert";

Deno.test("Recursion", async (t) => {
  await t.step({
    name: "Does the bus serve the line?",
    fn: () => {
      const linesAndBuses = [
        [1, [11, 22, 33]],
        [3, [44, 55, 66]],
        [5, [11, 55, 77]],
        [7, [11, 44, 33]],
        [9, [44, 55, 66]],
        [17, [11, 66, 77]],
      ];

      const busServesLine = (line, bus) => {
        for (const [lineNumber, buses] of linesAndBuses) {
          if (lineNumber === line) {
            return buses.includes(bus);
          }
        }
        return false;
      };

      const generalResult = busServesLine(5, 77);
      const nonExistentLineResult = busServesLine(100, 11);
      const nonExistentBusResult = busServesLine(1, 100);
      const nonExistentLineAndBusResult = busServesLine(100, 100);
      assertEquals(generalResult, true);
      assertEquals(nonExistentLineResult, false);
      assertEquals(nonExistentBusResult, false);
      assertEquals(nonExistentLineAndBusResult, false);
    },
  });
  await t.step({
    name: "Is a string a palindrome?",
    fn: () => {
      // A palindrome is a word, phrase, number, or other sequence of characters
      // that reads the same forward and backward (ignoring spaces, punctuation,
      // and capitalization).
      // If the string is empty, return true
      // If the first and last characters are equal, check the rest of the string
      // If the first and last characters are not equal, return false

      const isPalindrome = (str) => {
        const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (clean.length <= 1) return true;
        if (clean[0] !== clean[clean.length - 1]) return false;
        return isPalindrome(clean.slice(1, -1));
      };

      const generalResult = isPalindrome("A man, a plan, a canal: Panama");
      const emptyStringResult = isPalindrome("");
      const nonPalindromeResult = isPalindrome("hello");

      assertEquals(generalResult, true);
      assertEquals(emptyStringResult, true);
      assertEquals(nonPalindromeResult, false);
    },
  });
  // find the longest repeating character in a string
  await t.step({
    name: "Find the longest repeating substring",
    fn: () => {
      // If the string is empty, return an empty string
      // If the first character is the first character of the substring
      // You might want to keep track of the longest chain overall and the current chain
      // Once the current chain is over, check if it is longer than the longest chain and replace if so

      const longestRepeatingCharacterChain = (str) => {
        if (str.length === 0) return "";

        let maxChar = str[0];
        let maxLen = 1;

        let currentChar = str[0];
        let currentLen = 1;

        for (let i = 1; i < str.length; i++) {
          if (str[i] === currentChar) {
            currentLen++;
          } else {
            if (currentLen > maxLen) {
              maxLen = currentLen;
              maxChar = currentChar;
            }
            currentChar = str[i];
            currentLen = 1;
          }
        }

        // Final check at end of string
        if (currentLen > maxLen) {
          maxLen = currentLen;
          maxChar = currentChar;
        }

        return maxChar.repeat(maxLen);
      };

      const generalResult = longestRepeatingCharacterChain("222aabbbbcc");
      const emptyStringResult = longestRepeatingCharacterChain("");
      const nonRepeatingResult = longestRepeatingCharacterChain("abc");
      assertEquals(generalResult, "bbbb");

      assertEquals(emptyStringResult, "");
      assertEquals(nonRepeatingResult, "a");
    },
  });
  await t.step({
    name: "How high?",
    fn: () => {
      const buildingsAndHeights = [
        ["Empire State Building", 443],
        ["Burj Khalifa", 828],
        ["Shanghai Tower", 632],
        ["One World Trade Center", 541],
        ["Taipei 101", 508],
      ];
      
      const howHigh = (building) => {
        for (const [name, height] of buildingsAndHeights) {
          if (name === building) {
            return height;
          }
        }
        return -1;
      };

      const generalResult = howHigh("Burj Khalifa");
      const nonExistentBuildingResult = howHigh("Hanoi Tower");
      const emptyBuildingResult = howHigh("");
      assertEquals(generalResult, 828);
      assertEquals(nonExistentBuildingResult, -1);
      assertEquals(emptyBuildingResult, -1);
    },
  });
});
