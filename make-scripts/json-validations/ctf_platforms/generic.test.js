const Ajv = require("ajv").default;
const path = require("path");
const fs = require("fs");
const addFormats = require("ajv-formats");

const ajv = new Ajv({allErrors: true, removeAdditional: "all"})
addFormats(ajv)

const genericMetaSchema = {
  type: "object",
  properties: {
    ctf_platforms: {
      type: "array",
      items: {
        type: "object",
        properties: {
          $name: {
            type: "string"
          },
          website: {
            type: "string",
            format: "uri"
          },
          source: {
            type: "string"
          },
          language: {
            type: "string"
          },
          price: {
            enum: ["Free", "Paid"]
          },
          description: {
            type: "string"
          },
        },
        required: ["name", "source", "description", "language", "price"],
        additionalProperties: false
      },
      minItems: 1
    }
  },
  required: ["ctf_platforms"]
}

const validate = ajv.compile(genericMetaSchema)

const destFolder = path.join(__dirname, "../../../data/ctf_platforms")
async function validator(path) {
  const dir = await fs.promises.opendir(path)
  let errors = []
  for await (const dirent of dir) {
    const file = await fs.readFileSync(path +  "/" + dirent.name)
    const targetJSON = JSON.parse(file.toString())
    let valid = validate(targetJSON)
    if (!valid) {
      errors.push(...validate.errors)
    }
  }
  return errors
}
test("", () => {
  return validator(destFolder).then(res => expect(res).toEqual([]))
})
