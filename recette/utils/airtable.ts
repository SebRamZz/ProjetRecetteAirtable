import Airtable from "airtable";

export const base = new Airtable({
    apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY as string,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID as string);
