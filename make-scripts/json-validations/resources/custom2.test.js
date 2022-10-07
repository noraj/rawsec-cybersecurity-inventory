const Ajv = require("ajv").default;
const path = require("path");
const fs = require("fs");
const addFormats = require("ajv-formats")

include = [
  "information_news_blog.json",
  "non_english.json"
]
const ajv = new Ajv({allErrors: true})
addFormats(ajv)

const custom2 = {
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
          language: {
            type: "string"
          }
        },
        required: ["name", "description", "price", "language"],
        additionalProperties: false
      },
      minItems: 1
    }
  },
  required: ["resources"]
}

const validate = ajv.compile(custom2)

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
          errors.push(...validate.errors)
        }
      }
    }
  return errors
}
test("", () => {
  return validator(destFolder).then(res => expect(res).toEqual([]))
})

