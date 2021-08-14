import { Client, LogLevel } from "@notionhq/client"
import { InputPropertyValueMap, PagesCreateResponse } from "@notionhq/client/build/src/api-endpoints"
import type { NextApiRequest, NextApiResponse } from 'next'
import { ParticipantToRegister } from "../../components/ParticipantForm/ParticipantForm"
import { NotReachableError } from "../../utils/notReachabelError"
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0
})


type Data = {
  name: string
}

enum NotionFieldType {
  Title = "title",
  RichText = "rich_text",
  Email = "email",
  Number = "number",
  MultiSelect = "multi_select",
  Select = "select"
}

interface BaseFieldDef  {
  name: string
}

interface TextFieldDef extends BaseFieldDef {
  type: NotionFieldType.Title | NotionFieldType.RichText | NotionFieldType.Email | NotionFieldType.Select,
  value?: string
}

interface NumberFieldDef extends BaseFieldDef {
  type: NotionFieldType.Number,
  value?: number
}

interface ArrayFieldDef extends BaseFieldDef {
  type: NotionFieldType.MultiSelect,
  value?: string[]
}

type NotionFieldDef = TextFieldDef | NumberFieldDef | ArrayFieldDef


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const parsedValues = JSON.parse(req.body) as ParticipantToRegister
  const fieldsDef = prepareData(parsedValues)

  try {
    await addRecordToNotion(fieldsDef)
    res.status(200)
  } catch (e) {
    Sentry.setTag("node_env", process.env.NODE_ENV)
    Sentry.setTag("end", "backend")
    Sentry.setTag("buildNumber", process.env.CONFIG_BUILD_ID)
    Sentry.setContext("values", parsedValues)
    Sentry.setContext("headers", req.headers)
    Sentry.captureEvent(e)
    res.status(500).json(e)
  }
}

export const addRecordToNotion = (values: NotionFieldDef[]): Promise<PagesCreateResponse> => {
  const notion = new Client({ auth: process.env.PUBLIC_NOTION_KEY })
  const databaseId = process.env.PUBLIC_NOTION_DATABASE_ID

  if (!databaseId) {
    throw new Error("DatabaseId is not defined.")
  }

  return notion.pages.create({
    parent: { database_id: databaseId},
    properties: serializeNotionFieldDef(values),
  })
}

const prepareData = (values: ParticipantToRegister): NotionFieldDef[] => [
  {
    name: "Jméno",
    type: NotionFieldType.Title,
    value: values.firstName
  },
  {
    name: "Příjmení",
    type: NotionFieldType.RichText,
    value: values.surName
  },
  {
    name: "E-mail",
    type: NotionFieldType.Email,
    value: values.email
  },
  {
    name: "Množství",
    type: NotionFieldType.Number,
    value: values.count !== "more" ? Number(values.count) : values.familyCount
  },
  {
    name: "Jídlo",
    type: NotionFieldType.MultiSelect,
    value: values.kindOfFood
  },
  {
    name: "Specialita",
    type: NotionFieldType.RichText,
    value: values.kindOfFoodSpec
  },
  {
    name: "Příjezd",
    type: NotionFieldType.Select,
    value: values.arrival
  },
  {
    name: "Odjezd",
    type: NotionFieldType.Select,
    value: values.departure
  },
  {
    name: "Poznámka",
    type: NotionFieldType.RichText,
    value: values.note
  }
]

const getNotionFieldDef = (def: NotionFieldDef): InputPropertyValueMap => {
  switch (def.type) {
    case NotionFieldType.Title:
      return {
        [def.name]: {
          type: def.type,
          title: [
            {
              type: "text",
              text: {
                content: def.value ?? ""
              }
            }
          ]
        }
      }
    case NotionFieldType.RichText:
      return {
        [def.name]: {
          type: def.type,
          rich_text: [
            {
              type: "text",
              text: {
                content: def.value ?? ""
              }
            }
          ]
        }
      }
    case NotionFieldType.Email:
      return {
        [def.name]: {
          type: def.type,
          [def.type]: def.value ?? ""
        }
      }
    case NotionFieldType.Number:
      return {
        [def.name]: {
          type: def.type,
          [def.type]: def.value ?? NaN
        }
      }
    case NotionFieldType.Select:
      return {
        [def.name]: {
          type: def.type,
          [def.type]: {
            name: def.value ?? ""
          }
        }
      }
    case NotionFieldType.MultiSelect:
      return {
        [def.name]: {
          type: def.type,
          [def.type]: (def.value ?? []).map(item => ({
            name: item ?? ""
          }))
        }
      }
    default:
      throw new NotReachableError("Unknown form input type", (def as any).type as never)
    }
  }

const serializeNotionFieldDef = (values: NotionFieldDef[]): InputPropertyValueMap => values.reduce((acc, item) => ({...acc, ...getNotionFieldDef(item)}), {})

