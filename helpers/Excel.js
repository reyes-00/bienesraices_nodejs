import excel from 'xlsx'

const subidaExcel=(ruta)=>{
  const workbook = excel.readFile(ruta);
  const sheet_name_list = workbook.SheetNames;
  const xlData = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  
  return xlData;

  
}

export default subidaExcel