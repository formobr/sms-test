import axios from "axios";
import store from "../store";
export default defineEventHandler(async (event) => {
  const result = [
    {
      name: "Discord",
      value: null,
    },
    {
      name: "Telegram",
      value: "tg",
    },
    {
      name: "Twitter",
      value: "tw",
    },
    {
      name: "Viu",
      value: "wv",
    },
    {
      name: "BigC",
      value: "zu",
    },
    {
      name: "LINE MAN",
      value: "lim",
    },
    {
      name: "The1",
      value: "the",
    },
    {
      name: "Trueid",
      value: "tru",
    },
    {
      name: "Line msg",
      value: "me",
    },
  ];
  const query = getQuery(event);
  const { country, login, apiPassword, service, provider } = query;
  for (const [i, service] of store.services.entries()) {
    const params = {
      clientId: login,
      apiPassword: apiPassword,
      service: service.value,
      country: country.toLowerCase(),
      provider: provider,
    };
    await axios
      .post("https://proxy.otp-service.online/v1/GetNumbersCount", params)
      .then((data) => {
        result[i].value = data.data.count;
      })
      .catch((err) => console.log(err));
  }
  return result;
});
