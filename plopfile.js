module.exports = (plop) => {
  plop.setGenerator("component", {
    description: "Create a component",
    // User input prompts provided as arguments to the template
    prompts: [
      {
        // Raw text input
        type: "input",
        // Variable name for this input
        name: "name",
        // Prompt to display on command line
        message: "What is your component name?",
      },
    ],
    actions: [
      {
        // Add a new file
        type: "add",
        // Path for the new file
        path: "src/components/{{pascalCase name}}/{{pascalCase name}}.tsx",
        // Handlebars template used to generate content of new file
        templateFile: "templates/Component/Component.tsx.hbs",
      },
      {
        type: "add",
        path: "src/components/{{pascalCase name}}/index.ts",
        templateFile: "templates/Component/index.ts.hbs",
      },
      {
        // Adds an index.js file if it does not already exist
        type: "add",
        path: "src/components/index.ts",
        templateFile: "templates/injectable-index.ts.hbs",
        // If index.js already exists in this location, skip this action
        skipIfExists: true,
      },
      {
        // Plop actions with type: 'append' search for a pattern within a file and inject a rendered template after the pattern match locations.
        type: "append",
        path: "src/components/index.ts",
        // Pattern tells plop where in the file to inject the template
        pattern: `/* PLOP_INJECT_IMPORT */`,
        template: `import {{pascalCase name}} from './{{pascalCase name}}';`,
      },
      {
        type: "append",
        path: "src/components/index.ts",
        pattern: `/* PLOP_INJECT_EXPORT */`,
        template: `\t{{pascalCase name}},`,
      },
    ],
  });
};
