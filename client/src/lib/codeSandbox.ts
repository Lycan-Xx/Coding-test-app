export async function runCode(code: string): Promise<string> {
  try {
    // Create a safe evaluation context
    const context = {
      console: {
        log: (...args: any[]) => output.push(args.join(' ')),
        error: (...args: any[]) => output.push(`Error: ${args.join(' ')}`),
      },
      setTimeout: () => {},
      setInterval: () => {},
      output: [] as string[],
    };

    const fn = new Function('context', `
      with (context) {
        ${code}
      }
      return context.output;
    `);

    const output = fn(context);
    return output.join('\n');
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return `Runtime Error: ${message}`;
  }
}