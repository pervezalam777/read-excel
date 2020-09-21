const fs = require('fs') 
const path = require('path')
const XLSX = require('xlsx')

var workbook = XLSX.readFile(path.join(__dirname, 'master.xlsx'));
var sheet_name_list = workbook.SheetNames;
console.log(sheet_name_list)
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
let lang = {}
for(let i = 1; i < xlData.length; i++){
  const obj = xlData[i]
  let langKey = '';
  let groupKey = '';
  for(let key in obj){
    if(key === '__EMPTY') continue;
    if(key === 'Translations'){
      groupKey = obj[key];
      continue;
    }
    if(key === '__EMPTY_1'){
      langKey = obj[key]
      continue;
    }
    let locale = lang[key] = lang[key] || {};
    let innerGroup = locale[groupKey] = locale[groupKey] || {}
    innerGroup[langKey] = obj[key]
  }
}

for( let dataKey in lang){
  console.log("------",dataKey);
  const dirPath = path.join(__dirname, sheet_name_list[1], 'locales', dataKey)
  fs.mkdirSync(dirPath, {recursive: true});
  fs.writeFileSync(path.join(dirPath, 'translation.json'), JSON.stringify(lang[dataKey], null, 2))
}