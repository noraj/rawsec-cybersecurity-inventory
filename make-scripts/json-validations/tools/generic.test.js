const Ajv = require("ajv").default;
const path = require("path");
const fs = require("fs");
const addFormats = require("ajv-formats")

include = [
  "binary_exploitation.json",
  "bug_bounty.json",
  "code_analysis.json",
  "adversary_simulation.json",
  "cloud.json"
]
const ajv = new Ajv({allErrors: true})
addFormats(ajv)

const custom1 = {
  type: "object",
  properties: {
    tools: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string"
          },
          website: {
            type: "string",
            format: "uri",
          },
          source: {
            type: "string",
            format: "uri",
          },
          description: {
            type: "string"
          },
          price: {
            enum: ["Free", "Paid"]
          },
          keywords: {
            type: "string"
          },
          language: {
            type: "string"
          },
          online: {
            enum: ["True", "False"]
          },
          blackarch: {
            type: "string"
          }
        },
        required: ["name", "description", "price", "online"],
        additionalProperties: false
      },
      minItems: 1
    }
  },
  required: ["tools"]
}

const validate = ajv.compile(custom1)

const destFolder = path.join(__dirname, "../../../data/tools")
async function validator(path) {
  const dir = await fs.promises.opendir(path)
  let errors = []
  for await (const dirent of dir) {
    if (include.includes(dirent.name)){
      const file = await fs.readFileSync(path +  "/" + dirent.name)
        const targetJSON = JSON.parse(file.toString())
        let valid = validate(targetJSON)
        if (!valid) {
          console.error("Error at " + dirent.name)
          console.error(validate.errors)
          errors.push(...validate.errors)
        }
      }
    }
  return errors
}

test("", () => {
  return validator(destFolder).then(res => expect(res.length).toEqual(0))
})

