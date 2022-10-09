const Ajv = require("ajv").default;
const path = require("path");
const fs = require("fs");
const addFormats = require("ajv-formats")

include = [
  "national_security_agencies_and_services.json"
]
const ajv = new Ajv({allErrors: true})
addFormats(ajv)

const custom4 = {
  type: "object",
  properties: {
    resources: {
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
          description: {
            type: "string"
          },
          country: {
            type: "string"
          },
          keywords:{
            type: "string"
          }
        },
        required: ["name", "description", "website"],
        additionalProperties: false
      },
      minItems: 1
    }
  },
  required: ["resources"]
}

const validate = ajv.compile(custom4)

const destFolder = path.join(__dirname, "../../../data/resources")
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

