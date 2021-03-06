/* eslint-disable */
export const langSnippets : object = {
    "javascript": "let i = 10;\n\nfunction power(num) {\n  num = num * num;\n  console.log(num);\n}\n\npower(i);",
    "typescript": "let i : number = 10;\n\nfunction power(num: number) : void {\n  num = num * num;\n  console.log(num);\n}\n\power(i);",
    "python": "\ndef foo():\n  print('hello world')\n\n\nif __name__ == '__main__':\n  for x in range(10):\n      foo()",
    "python3": "\ndef foo():\n  print('hello world')\n\n\nif __name__ == '__main__':\n  for x in range(10):\n      foo()",
    "python2": "\ndef foo():\n  print 'hello world'\n\n\nif __name__ == '__main__':\n  for x in range(10):\n      foo()",
    "java8":"public class Main { \n\n   public static void main(String[] args) {\n      System.out.println(\"Hello World\");\n    }\n\n}",
    "java11":"public class Main { \n\n   public static void main(String[] args) {\n      System.out.println(\"Hello World\");\n    }\n\n}",
    "java":"public class Main { \n\n   public static void main(String[] args) {\n      System.out.println(\"Hello World\");\n    }\n\n}",
    "go": "package main;\n\nimport \"fmt\";\n\nfunc main() {\n  fmt.Println(\"Hello World\")\n}",
    "c":"# include <stdio.h>\n\nint main() {\n\n  printf(\"Hello World!\");\n  return 0;\n\n}",
    "c++":"\n#include <iostream>\n\nint main() {\n\n   std::cout << \"Hello World!\";\n   return 0;\n\n}"
}