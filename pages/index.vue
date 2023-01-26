<template>
  <div class="container">
    <div class="row mb-4">
      <div class="col-12">
        <h1>Manual API</h1>
        <div class="d-flex align-items-center mb-2">
          <div class="flex-fill mr-2">
            <div class="input-group">
              <input
                @change="saveValue('login', login)"
                class="form-control"
                type="text"
                v-model="login"
                placeholder="Your client ID"
              />
            </div>
          </div>

          <div class="flex-fill">
            <div class="input-group">
              <input
                @change="saveValue('password', apiPassword)"
                class="form-control"
                type="text"
                v-model="apiPassword"
                placeholder="Your password"
              />
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center mb-2">
          <div class="flex-fill mr-2">
            <select class="form-select" v-model="selectedCountry">
              <option
                v-for="(country, value, index) of countries"
                :key="index"
                :value="country.name"
              >
                {{ country.name }}
              </option>
            </select>
          </div>
          <div
            v-if="countries[selectedCountry].providers"
            class="flex-fill mr-2"
          >
            <select class="form-select" v-model="provider">
              <option
                v-for="(provider, index) of countries[selectedCountry]
                  .providers"
                :key="index"
                :value="provider"
              >
                {{ provider }}
              </option>
            </select>
          </div>
          <div class="flex-fill mr-2">
            <select class="form-select" v-model="selectedService">
              <option
                v-for="(service, index) of services"
                :key="index"
                :value="service"
              >
                {{ service.name }}
                <span v-if="numbersCount">{{ numbersCount[index].value }}</span>
                <loading-state v-if="numbersStatus" />
              </option>
            </select>
          </div>
          <div class="flex-fill mr-2">
            <select class="form-select" v-model="clientId">
              <option v-for="index of 10" :key="index" :value="index">
                {{ index }}
              </option>
            </select>
          </div>
          <div>
            <button class="btn btn-primary" @click="getNumber">
              Get number
            </button>
          </div>
        </div>
        <div
          v-if="result && !loading"
          class="alert"
          :class="result.value.error ? 'alert-danger' : 'alert-success'"
        >
          {{ result.value.message }}
        </div>
        <loading-state v-if="loading" />
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <loading-state v-if="tableStatus" />
        <div class="table-responsive">
          <table v-if="dbData" class="table table-striped align-middle t-data">
            <thead>
              <tr>
                <th colspan="2">
                  <Datepicker v-model="datePick" range></Datepicker>
                </th>
                <th></th>
                <th></th>
                <th>
                  <div class="input-group">
                    <input
                      class="form-control"
                      type="number"
                      placeholder="Search"
                      v-model="search"
                    />
                  </div>
                </th>
                <th></th>
                <th></th>
                <th>
                  <button
                    @click="hideAll"
                    class="btn btn-secondary mb-2 col-12"
                  >
                    Hide all</button
                  ><br />
                </th>
              </tr>
              <tr class="sort">
                <th scope="col">
                  <div class="d-flex">
                    <div>Date</div>
                    <div>
                      <input
                        id="dateup"
                        type="radio"
                        v-model="sortBy"
                        :value="{ val: 'datetime', direction: true }"
                      />
                      <label for="dateup"> 🔽</label>
                    </div>
                    <div>
                      <input
                        id="datedown"
                        type="radio"
                        v-model="sortBy"
                        :value="{ val: 'datetime', direction: false }"
                      />
                      <label for="datedown"> 🔼</label>
                    </div>
                  </div>
                </th>
                <th scope="col">Time</th>
                <th scope="col">
                  <div class="d-flex">
                    <div>Client ID</div>
                    <div>
                      <input
                        id="clientidup"
                        type="radio"
                        v-model="sortBy"
                        :value="{ val: 'clientid', direction: true }"
                      />
                      <label for="clientidup"> 🔽</label>
                    </div>
                    <div>
                      <input
                        id="clientiddown"
                        type="radio"
                        v-model="sortBy"
                        :value="{ val: 'clientid', direction: false }"
                      />
                      <label for="clientiddown"> 🔼</label>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex">
                    <div>Service</div>
                    <div>
                      <input
                        id="serviceup"
                        type="radio"
                        v-model="sortBy"
                        :value="{ val: 'service', direction: true }"
                      />
                      <label for="serviceup"> 🔽</label>
                    </div>
                    <div>
                      <input
                        id="servicedown"
                        type="radio"
                        v-model="sortBy"
                        :value="{ val: 'service', direction: false }"
                      />
                      <label for="servicedown"> 🔼</label>
                    </div>
                  </div>
                </th>
                <th scope="col">Number</th>
                <th scope="col">Operator</th>
                <th scope="col">Code</th>
                <th scope="col">
                  <button @click="showAll" class="btn btn-success col-12">
                    Show all
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) of sortedArray"
                :key="index"
                :class="{ 'd-none': row.hidden }"
              >
                <td>
                  {{ getLocalDate(row.datetime) }}
                </td>
                <td>{{ getLocalTime(row.datetime) }}</td>
                <td>
                  {{ row.clientid }}
                </td>
                <td>
                  {{ row.service }}
                </td>
                <td>
                  {{ row.number }}
                  <button
                    v-if="row.number != '0'"
                    @click="copyToClipboard(row.number, countries[row.country].substring)"
                    class="btn btn-success"
                  >
                    copy
                  </button>
                </td>
                <td>
                  {{ row.operator }}
                </td>
                <td>
                  {{ row.code }}
                  <button
                    v-if="row.code"
                    @click="copyToClipboard(row.code)"
                    class="btn btn-success"
                  >
                    copy
                  </button>
                </td>
                <td>
                  <button
                    @click="hideOne(row.numActivation)"
                    class="btn btn-danger col-12"
                  >
                    Hide
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
//local storage
function saveValue(key, val) {
  localStorage.setItem(key, val);
}

function removeValue(key) {
  localStorage.removeItem(key);
}

const login = ref();
const apiPassword = ref();

//Countries list -- get list from API in server/api/countriesAndServices.js or use default list in server/store/
const countries = ref();
const services = ref();

const fetchData = await useFetch("/api/countriesAndServices");

countries.value = fetchData.data.value.countries;
services.value = fetchData.data.value.services;

const selectedCountry = ref(countries.value.Thailand.name);
const selectedService = ref(services.value[0]);
const clientId = ref(1);

// Get number
const result = ref();
const loading = ref();

const getNumber = async () => {
  loading.value = true;
  const { data } = await useFetch(`/api/getNumber`, {
    query: {
      country: selectedCountry.value,
      service: selectedService.value.value,
      shortNameService: selectedService.value.name,
      provider: provider.value,
      login: login.value,
      apiPassword: apiPassword.value,
      clientId: clientId.value,
    },
  });
  result.value = data;
  loading.value = false;
  dbData.value = await getData(login.value);
};
//Websocket setup
import { io } from "socket.io-client";
// const rr = await useFetch("/api/socket")

const dbData = ref();
const connected = ref(false);

//Get data from table

watch(login, async (newVal) => {
  getOperator(newVal);
  dbData.value = await getData(newVal);
});
const tableStatus = ref();
async function getData(log) {
  tableStatus.value = true;
  const { data } = await useFetch(() => `/api/getDb`, {
    query: {
      login: log,
    },
  });
  tableStatus.value = null;
  return data.value;
}

const copyToClipboard = (val, substr) => {
  let number = val.toString()
  if (substr) number = number.substr(substr)
  navigator.clipboard.writeText(number);
};

//local time
import dateNode from "date-and-time";
const getLocalDate = (time) => {
  if (!time) return null;
  const date = new Date(time);
  
  const dateUser = date.getTimezoneOffset() / -60;
  date.setHours(date.getHours() + dateUser);
  
  return dateNode.format(date, "DD.MM.YYYY");
};
const getLocalTime = (time) => {
  if (!time) return null;
  const date = new Date(time);
  const dateUser = date.getTimezoneOffset() / -60;
  date.setHours(date.getHours() + dateUser);
  const userTime = dateNode.format(date, "HH:mm");
  return userTime
};

//Search and sort
const sortBy = ref({ val: "datetime", direction: true });
const search = ref();

const sortedArray = computed(() => {
  let sortedArray = dbData.value;
  if (search.value) {
    sortedArray = sortedArray.filter(item => item.number.toString().includes(search.value.toString()))
    return sortedArray
  }

  if (datePick.value) {
    const date = [
      new Date(datePick.value[0]).toJSON(),
      new Date(datePick.value[1]).toJSON(),
    ];

    sortedArray = sortedArray.filter(
      (item) => item.datetime >= date[0] && item.datetime <= date[1]
    );
  }

  sortedArray.sort(function (a, b) {
    // nulls sort after anything else
    if (a[sortBy.value.val] === null) {
      return 1;
    }
    if (b[sortBy.value.val] === null) {
      return -1;
    }
    if (a[sortBy.value.val] > b[sortBy.value.val]) {
      if (sortBy.value.direction) return -1;
      return 1;
    }
    if (a[sortBy.value.val] < b[sortBy.value.val]) {
      if (sortBy.value.direction) return 1;
      return -1;
    }
    return 0;
  });
  return sortedArray;
});

//select operator
const provider = ref(countries.value[selectedCountry.value].providers[0]);
const numbersCount = ref();
watch(selectedCountry, async () => {
  provider.value = "ANY";
  await getOperator(login.value);
});
watch(provider, async () => {
  await getOperator(login.value);
});
const numbersStatus = ref();

async function getOperator(log) {
  numbersCount.value = null;
  numbersStatus.value = true;
  const { data } = await useLazyFetch(() => `/api/getOperator`, {
    query: {
      country: selectedCountry.value,
      login: log,
      apiPassword: apiPassword.value,
      provider: provider.value,
      service: selectedService.value.value,
    },
  });
  numbersStatus.value = null;
  numbersCount.value = data.value;
}

// hide rows
const hideOne = async (num) => {
  await useFetch("/api/hideOne", {
    query: {
      numActivation: num,
    },
  });
};

const hideAll = async () => {
  await useFetch("/api/hideAll", {
    query: {
      id: login.value,
    },
  });
};

const showAll = async () => {
  await useFetch("/api/showAll", {
    query: {
      id: login.value,
    },
  });
};

//date picker
const clearDate = () => {
  datePick.value = null;
  localStorage.dateFrom = null;
  localStorage.dateTo = null;
};
const datePick = ref();

watch(datePick, (newVal) => {
  if (newVal) {
    saveValue("dateFrom", newVal[0]);
    saveValue("dateTo", newVal[1]);
  } else {
    removeValue("dateFrom");
    removeValue("dateTo");
  }
});

import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

onMounted(async () => {
  if (localStorage.login) login.value = localStorage.login;
  if (localStorage.password) apiPassword.value = localStorage.password;
  if (localStorage.dateFrom && localStorage.dateTo)
    datePick.value = [localStorage.dateFrom, localStorage.dateTo];
  const socket = io();

  socket.on("connect", () => {
    connected.value = socket.connected;
    console.log(`client connected ${socket.id}`);
  });
  socket.on("disconnect", () => {
    connected.value = socket.connected;
    console.log(`client reconnected ${socket.id}`);
  });
  socket.on("message", async (data) => {
    dbData.value = await getData(login.value);
  });
});
</script>

<style lang="scss" scoped>
.mr-2 {
  margin-right: 2rem;
}
.t-data {
  .sort {
    input {
      height: 0;
      position: absolute;
      width: 0;
      visibility: hidden;
    }
    label {
      cursor: pointer;
      margin: 0 0.1rem;
    }
  }
  td {
    padding: 1rem;
  }
}
.form-select {
  option span {
    color: red;
  }
}
</style>
