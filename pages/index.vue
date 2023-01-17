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
                v-for="(country, index) of countries"
                :key="index"
                :value="country.value"
              >
                {{ country.name }}
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
        <loading-state v-if="loading"/>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <loading-state v-if="tableStatus"/>
        <table v-if="dbData" class="table table-borderless align-middle">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Num Activation</th>
              <th scope="col">Client ID</th>
              <th scope="col">Number</th>
              <th scope="col">Services</th>
              <th scope="col">Code</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) of dbData" :key="index">
              <td>
                {{ row.datetime }}
              </td>
              <td>
                {{ row.numactivation }}
              </td>
              <td>
                {{ row.clientid }}
              </td>
              <td>
                {{ row.number }} <button v-if="row.number != '0'" @click="copyToClipboard(row.number)" class="btn btn-success">copy</button>
              </td>
              <td>
                {{ row.service }}
              </td>
              <td>
                {{ row.code }} <button v-if="row.code" @click="copyToClipboard(row.code)" class="btn btn-success">copy</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-12">
        <h3>For test post request to /api/updatecode</h3>
        <div class="d-flex align-items-center mb-2">
          <div class="flex-fill mr-2">
            <input class="form-control" type="text" placeholder="Num activation" v-model="numActivation">
          </div>
          <div class="flex-fill mr-2">
            <input class="form-control"  type="text" v-model="number"  placeholder="Number">
          </div>
          <div class="flex-fill mr-2">
            <input class="form-control"  type="text" v-model="code" placeholder="Code">
          </div>
          <div class="flex-fill mr-2">
            <input class="form-control"  type="text" v-model="text" placeholder="Text">
          </div>
          <div>
            <button @click='sendRequest' class="btn btn-primary">Send</button>
          </div>
        </div>
        <div v-if="requestResult" class="alert alert-primary">
          {{requestResult}}
        </div>
        <loading-state v-if="requestStatus" />
      </div>
      <button class="btn btn-primary" @click="clearTable()">Clear table</button>
    </div>
  </div>

</template>

<script setup>
const login = ref();
const apiPassword = ref();

//Countries list -- get list from API in server/api/countriesAndServices.js or use default list in server/store/
const countries = ref();
const services = ref();

const fetchData = await useFetch("/api/countriesAndServices");

countries.value = fetchData.data.value.countries;
services.value = fetchData.data.value.services;

const selectedCountry = ref(countries.value[0].value);
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
      service: selectedService.value.name,
      shortNameService: selectedService.value.value,
      login: login.value,
      apiPassword: apiPassword.value,
      clientId: clientId.value,
    },
  });
  result.value = data;
  loading.value = false;
  dbData.value = await getData(login.value)
};
//Websocket setup
import { io } from "socket.io-client";
// const rr = await useFetch("/api/socket")

const dbData = ref();
const connected = ref(false);


onMounted(async () => {
  if (localStorage.login) login.value = localStorage.login;
  if (localStorage.password) apiPassword.value = localStorage.password;
  const socket = io();

  socket.on("connect", () => {
    connected.value = socket.connected;
    console.log(`client connected ${socket.id}`);
  });
  socket.on("disconnect", () => {
    connected.value = socket.connected;
  });
  socket.on("message", async (data) => {
    console.log(data);
    dbData.value = await getData(login.value);
  });

});

//Get data from table

watch(login, async (newVal) => {
  dbData.value = await getData(newVal);
});
const tableStatus = ref()
async function getData(log) {
  tableStatus.value = true
  const { data } = await useFetch(() => `/api/getDb`, {
    query: {
      login: log,
    },
  });
  tableStatus.value = null
  return data.value;
}

const copyToClipboard = (val) => {
  navigator.clipboard.writeText(val)
}


//TEST autoRenew data
const numActivation = ref()
const number = ref()
const code = ref()
const text = ref()
const requestStatus = ref()
const requestResult = ref()
  //send post request to /api/updateCode
const sendRequest = async () => {
  requestStatus.value = true
  const {data} = await useFetch('/api/updateCode', {
    query: {
      numActivation:numActivation, 
      number: number, 
      code: code, 
      text:text
    }
  })
  requestStatus.value = null
  requestResult.value = data.value
}

async function clearTable () {
  const {data} = await useFetch('/api/clearTable')
  console.log(data.value)
}


</script>

<style lang="scss" scoped>
.mr-2 {
  margin-right: 2rem;
}
</style>
