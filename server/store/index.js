const countries = {
  Thailand:{
    name: "Thailand",
    value: "th",
    providers: ['ANY', 'AIS', 'dtac', 'truemove', ],
    substring: 1
  },
  Laos:{
    name: "Laos",
    value: "lo",
    providers: ['ANY','telekom'],
    substring: 2
  },
  Vietnam:{
    name: "Vietnam",
    value: "vn",
    providers: ['ANY'],
    substring: 3
  },
}
const services = [
  {
    name: "Discord",
    value: "ds",
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

export default { countries, services };
