import { ApiClient } from "@mondaydotcomorg/api";

const monday_api = new ApiClient(`${process.env.MONDAY_TOKEN}`)

module.exports = monday_api;