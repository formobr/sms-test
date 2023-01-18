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
          <div v-if="countries[selectedCountry].providers" class="flex-fill mr-2">
            <select class="form-select" v-model="provider">
              <option
                v-for="(provider, index) of countries[selectedCountry].providers"
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
                {{ service.name }} <span v-if="numbersCount">{{numbersCount[index].value}}</span> <loading-state  v-if="numbersStatus"/>
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
          <table
            v-if="dbData"
            class="table table-striped align-middle t-data"
          >
            <thead>
              <tr class="align-middle">
                <th scope="col">
                  <div class="d-flex justify-content-center">
                    <div>Date</div>
                    <div><input id="dateup" type="radio" v-model="sortBy" :value="{ val: 'datetime', direction: true }"/> <label for="dateup"> 🔽</label></div>
                  <div><input id="datedown" type="radio" v-model="sortBy" :value="{ val: 'datetime', direction: false }" /> <label for="datedown"> 🔼</label></div>
                  </div>
                  
                </th>
                <th scope="col">Num Activation</th>
                <th scope="col">
                  <div class="d-flex justify-content-center">
                    <div>Client ID</div>
                    <div><input id="clientidup" type="radio" v-model="sortBy" :value="{ val: 'clientid', direction: true }"/> <label for="clientidup"> 🔽</label></div>
                  <div><input id="clientiddown" type="radio" v-model="sortBy" :value="{ val: 'clientid', direction: false }" /> <label for="clientiddown"> 🔼</label></div>
                  </div>
                </th>
                <th scope="col">Number</th>
                <th scope="col">
                  <div class="d-flex justify-content-center">
                    <div>Service</div>
                    <div><input id="serviceup" type="radio" v-model="sortBy" :value="{ val: 'service', direction: true }"/> <label for="serviceup"> 🔽</label></div>
                  <div><input id="servicedown" type="radio" v-model="sortBy" :value="{ val: 'service', direction: false }" /> <label for="servicedown"> 🔼</label></div>
                  </div>
                </th>
                <th scope="col">Code</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) of sortedArray" :key="index">
                <td>
                  {{ getLocalTime(row.datetime) }}
                </td>
                <td>
                  {{ row.numactivation }}
                </td>
                <td>
                  {{ row.clientid }}
                </td>
                <td>
                  {{ row.number }}
                  <button
                    v-if="row.number != '0'"
                    @click="copyToClipboard(row.number)"
                    class="btn btn-success"
                  >
                    copy
                  </button>
                </td>
                <td>
                  {{ row.service }}
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
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-12">
        <button class="btn btn-danger" @click="clearTable()">
          Clear table
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
//local storage
function saveValue(key, val) {
  localStorage[key] = val;
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
  getOperator(newVal)
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

const copyToClipboard = (val) => {
  navigator.clipboard.writeText(val);
};

async function clearTable() {
  const { data } = await useFetch("/api/clearTable");
}

//local time
const getLocalTime =  (time) => {
  if (!time) return null
  const date = new Date(time)
  const dateUser = date.getTimezoneOffset() / -60
  date.setHours(date.getHours()+dateUser)
  const dateString = date.toString().split('GMT')
  return dateString[0]
}

//sort
const sortBy = ref({ val: "datetime", direction: true });

const sortedArray = computed(() => {
  const sortedArray = dbData.value;

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
const provider = ref(countries.value[selectedCountry.value].providers[0])
const numbersCount = ref()
watch(selectedCountry, async() =>{
  provider.value = 'ANY'
  await getOperator(login.value)
})
watch(provider, async() =>{
  await getOperator(login.value)
})
const numbersStatus = ref()

async function getOperator(log) {
  numbersCount.value = null
  numbersStatus.value = true
  const { data } = await useLazyFetch(() => `/api/getOperator`, {
    query: {
      country: selectedCountry.value,
      login: log,
      apiPassword: apiPassword.value,
      provider: provider.value,
      service: selectedService.value.value,
    },
  });
  numbersStatus.value = null
  numbersCount.value = data.value
}

//

onMounted(async () => {
  if (localStorage.login) login.value = localStorage.login;
  if (localStorage.password) apiPassword.value = localStorage.password;
  await getOperator()
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
    console.log(data);
    dbData.value = await getData(login.value);
  });
  
});
</script>

<style lang="scss" scoped>
.mr-2 {
  margin-right: 2rem;
}
.t-data {
  th {
    text-align: center;
    input {
      height: 0;
      position: absolute;
      width: 0;
      visibility: hidden;
    }
    label{
      cursor: pointer;
      margin: 0 0.1rem;
    }
  }
  td{
        padding: 2rem 1rem
  }
}
.form-select{
  option span{
    color: red;
  }
}
</style>
