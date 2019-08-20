import Web3 from "web3";
import { helpers, ExtendedWeb3, Unspent } from "leap-core";
import { countriesById } from "./api";
import { Player } from "./types";

let web3: ExtendedWeb3;
let web3Backend = "https://testnet-node.leapdao.org";

const playersAddresses = [
  // @vrde
  // "0x197970E48082CD46f277ABDb8afe492bCCd78300",
  // @tim
  // "0xd3a3d22b832d91107f91309b560734bd12057531",
  // usa
  "0x42f9b3Eb39Ff3c15DAA8d7F17242baF004678b3C",
  "0xd8b9f066ace53496b7F94D60bfa89f1d614c1dCe",
  "0x7903E9F9139A4F046cb897Fa2561d1cd888afFb0",
  "0x2c0EA790238BAf9541A773A8F19E9DA279424C24",
  "0x4F92D560ca8012e8f88F77cB01470006a87218dE",
  "0x68Aa2C55b793E816664FE8F7AF7b8E212a688375",
  "0xD7192B693B1Ce583BF01Ddb565b6bCd24BB48133",
  "0xeb1F751AA2e15F9C234D1D01fc11Ca7c8d532065",
  "0x6Fc768C849d7AEcDD263992d1550358c143E39ef",
  "0xE2b6DD20743C50973B3711bE546396A4466691D1",
  "0x0e83C7bd8A9358e0C4f3262e9dc6fb030Cfd249B",
  "0x9B228286A713d680c04770A761CEBD24465c5918",
  "0x75C1260a2282c3549Ed3Ea36c5BAA39a083CD2f7",
  "0x5331a2700eef3884b2a8C4D70F3D19A695026Ce8",
  "0x29538589Bb1E4951A7454134438D0F2Fe4918059",
  "0x9836B6d7ED30321771ab378ea076dea6E3495A32",
  "0x34B0a3EB207F41CB4E3A5896fa5E0982bFC10aAA",
  "0x779460C6441c5eBd3207e05979f75830b5720Bf9",
  "0xC0Da95ab13386910a8258A460D066eDa4233FD39",
  "0x2a838Df4701f4946d407eB6a57C44f739008469C",
  "0x66b249b7F1246322BDa4BA6154d11EaA4C858119",
  "0x1bbbECD24A09CDf74cE56639782Ef39C5EA70D9d",
  "0x918Ea9AF5452D4015d0b4F1603F13A2C8b6AB99b",
  "0x714314d5F3A603a9f1E5BE793e77977D6Ae10Df6",
  // usb
  "0xa6ae5bFE0032B2A8baF9FEF9dd46F7D45916D6b1",
  "0xAA325568b1c42B3D94732089110Ab1d5D4FD7B84",
  "0x7A67dA608E58957332EBE5CcbE7235376057e223",
  "0x0dD785927bE4a273a79A38e72738144a0035f101",
  "0x29E064D216626A5f7BF1f4431C3B3C0c88052dFb",
  "0x3C85539Cab749b96a556f66e8BdFCdBc62dB7627",
  "0x1A5FB47965fd49503b985FD5472b4D0cad7b5888",
  "0x644dc7c9588B180cA5fCE4b718D1f618df82EBcA",
  "0x5bEe1F494fd42ab2d4f86C4Ca89604533796F898",
  "0x5397359Afd4404Eb15483E780ad249ad8Fa83eD2",
  "0x98c591B1e90360aA13c5A71a2ce10721F0a31663",
  "0x6d2dE0D5383712823bB7231B923769fae55cc70c",
  "0xA547BEd3f73E5bE1f13Db7cC177e330eA0c01016",
  "0xbdd11b48624D4CE8D328Eeb929cd046fAee2266d",
  "0x79b959e6bFab8535C6650813593e390Fdf1357e9",
  "0x1eE40151e1aDA88F8A8c6Db2cF137BDF9F17296d",
  "0x1c14509D505dA99c2682610eDbb5991c6d2baa48",
  "0x4B4Afb3832049ff5C6F201a76A55Fb89cB4D62Ad",
  "0x5eDE045683Da2524bA2Ea5C3BCDe083bFb88E25D",
  "0xE9170D42a8e4C6F063f72F4e78719439cd8528ac",
  "0x0901f374D20F65655A8c209C52b29E8B539379d0",
  "0x8bDB8b3F35afd02b21e0fB2904c5f6b2e0Ac7f65",
  "0xbf40239f2715790E6f85638dd079468B615D5D93",
  "0x004A6f4cf80b7B3464A33bF4AB2f719D6d6ec0Be",
  "0xb3a7855b49288D19304E059f2C9944D11F5Eb116"
];

const names = [
  "China Coal",
  "Saudi Arabian Oil Company",
  "Gazprom",
  "National Iranian Oil",
  "ExxonMobil Corp",
  "Coal India",
  "Petroleos Mexicanos",
  "Russia (Coal)",
  "Royal Dutch Shell,",
  "China National Petroleum Corp",
  "BP",
  "Chevron",
  "Petroleos de Venezuela",
  "Abu Dhabi National Oil",
  "Poland Coal",
  "Peabody Energy ",
  "Sonatrach",
  "Kuwait Petroleum Corp",
  "Total",
  "BHP Billiton",
  "ConocoPhillips",
  "Petronas",
  "Lukoil",
  "Rio Tinto",
  "Nigerian National Petroleum Corp",
  "Petroliam Nasional Berhad",
  "Rosneft",
  "Arch Coal Inc",
  "Iraq National Oil",
  "Eni",
  "Anglo American",
  "Surgutneftegas",
  "Alpha Natural Resources",
  "Qatar Petroleum Corp",
  "PT Pertamina",
  "Kazakhstan Coal",
  "Statoil",
  "National Oil Corporation of Libya",
  "Consol Energy Inc",
  "Ukraine Coal",
  "RWE",
  "Oil & Natural Gas Corp",
  "Glencore",
  "TurkmenGaz",
  "Sasol",
  "Repsol",
  "Anadarko Petroleum Corp",
  "Egyptian General Petroleum",
  "Petroleum Development Oman",
  "Czech Republic Coal"
];

const getName = (address: string) => {
  const index = playersAddresses.indexOf(address);
  return index > -1 && index < names.length - 1
    ? names[index]
    : "Mr. Mysterious";
};

type Passport = {
  address: string;
  country: string;
  name: string;
  avatar: string;
  co2: number;
  trees: number;
};

const init = () => (web3 = helpers.extendWeb3(new Web3(web3Backend)));

const parseNickname = (data: string) =>
  Web3.utils.hexToUtf8(`0x${data.substring(2, 42)}`);

const parseAvatarUrl = (data: string) =>
  Web3.utils.hexToString(`0x${data.substring(42, 50)}`);

const parseTrees = (data: string) =>
  Web3.utils.hexToNumber(`0x${data.substring(50, 58)}`);

const parseCO2 = (data: string) =>
  Web3.utils.hexToNumber(`0x${data.substring(58, 66)}`);

const sumByCountry = (passports: Passport[], field: "co2" | "trees") =>
  passports.reduce(
    (prev, current) => {
      prev[current.country] = (prev[current.country] || 0) + current[field];
      return prev;
    },
    {} as { [countryId: string]: number }
  );

const getLeaderboard = async () => {
  const promises: Array<{
    id: string;
    task: Promise<Unspent[]>;
    value?: Unspent[];
  }> = playersAddresses.map(p => ({
    id: p,
    task: web3.getUnspent(p),
    value: []
  }));

  for (const promise of promises) {
    try {
      promise.value = await promise.task;
    } catch (error) {
      console.log(`error while fetching unspent of ${promise.id}: ${error}`);
      promise.value = [];
    }
  }

  const passports: Passport[] = promises
    .filter(p => p.value)
    .flatMap(p =>
      p
        .value!.map(u => u.output)
        .filter(o => countriesById[o.color])
        .map(o => ({
          address: o.value,
          country: countriesById[o.color],
          name: parseNickname(o.data!) || getName(p.id),
          avatar: parseAvatarUrl(o.data!),
          co2: parseCO2(o.data!),
          trees: parseTrees(o.data!)
        }))
    );

  const emissionsByCountry = sumByCountry(passports, "co2");
  const treesByCountry = sumByCountry(passports, "trees");

  const players = passports
    .map(p => ({
      id: p.address,
      name: p.name,
      avatar: p.avatar,
      event: p.country
    }))
    .reduce(
      (prev, current) => {
        prev[current.id] = current;
        return prev;
      },
      {} as { [id: string]: Player }
    );

  const trees = passports
    .filter(p => p.trees > 0)
    .sort((p1, p2) =>
      p1.trees > p2.trees ? -1 : p1.trees === p2.trees ? 0 : 1
    )
    .map(p => [p.address, p.trees] as [string, number]);

  const emissions = passports
    .filter(p => p.co2 > 0)
    .sort((p1, p2) => (p1.co2 > p2.co2 ? -1 : p1.co2 === p2.co2 ? 0 : 1))
    .map(p => [p.address, p.co2] as [string, number]);

  return { players, emissions, trees, emissionsByCountry, treesByCountry };
};

export const LeapAPI = {
  init,
  getStatus: async () => null,
  getPlayerList: async () => null,
  getLeaderboard: getLeaderboard,
  setServer: (server: string) => {
    web3Backend = server;
    if (web3) {
      init();
    }
  }
};

export default LeapAPI;
