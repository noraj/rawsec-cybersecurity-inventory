const Ajv = require("ajv").default;
const path = require("path");
const fs = require("fs");
const addFormats = require("ajv-formats");


exclude = [
  "project_transferred.json"
]
const ajv = new Ajv({allErrors: true, removeAdditional: "all"})
addFormats(ajv)

const genericMetaSchema = {
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
          website: {
            type: "string",
            format: "uri"
          },
          base: {
            type: "string"
          },
          description: {
            type: "string"
          },
          keywords:{
            type: "string"
          }
        },
        required: ["name", "base", "description", "website"],
        additionalProperties: false
      },
      minItems: 1
    }
  },
  required: ["operating_systems"]
}

const validate = ajv.compile(genericMetaSchema)

const destFolder = path.join(__dirname, "../../../data/operating_systems")
async function validator(path) {
  const dir = await fs.promises.opendir(path)
  let errors = []
  for await (const dirent of dir) {
    if (exclude.includes(dirent.name)) continue;
    const file = await fs.readFileSync(path +  "/" + dirent.name)
    const targetJSON = JSON.parse(file.toString())
    let valid = validate(targetJSON)
      if (!valid) {
        console.error("Error at " + dirent.name)
        console.error(validate.errors)
        errors.push(...validate.errors)
      }
    }
  return errors
}


test("", () => {
  return validator(destFolder).then(res => expect(res.length).toEqual(0))
})

