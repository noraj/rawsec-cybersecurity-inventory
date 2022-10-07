const Ajv = require("ajv").default;
const path = require("path");
const fs = require("fs");
const addFormats = require("ajv-formats");

include = [
  "project_transferred.json"
]
const ajv = new Ajv({allErrors: true, removeAdditional: "all"})
addFormats(ajv)

const custom = {
  type: "object",
  properties: {
    operating_systems: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string"
          },
          from: {
            type: "string"
          },
          to: {
            type: "string"
          }
        },
        required: ["name", "from", "to"],
        additionalProperties: false
      },
      minItems: 1
    }
  },
  required: ["operating_systems"]
}

const validate = ajv.compile(custom)

const destFolder = path.join(__dirname, "../../../data/operating_systems")
async function validator(path) {
  const dir = await fs.promises.opendir(path)
  let errors = []
  for await (const dirent of dir) {
    if (include.includes(dirent.name)){
      const file = await fs.readFileSync(path +  "/" + dirent.name)
        const targetJSON = JSON.parse(file.toString())
        let valid = validate(targetJSON)
        if (!valid) {
          errors.push(...validate.errors)
        }
      }
    }
  return errors
}
test("", () => {
  return validator(destFolder).then(res => expect(res).toEqual([]))
})

