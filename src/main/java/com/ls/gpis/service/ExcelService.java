package com.ls.gpis.service;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.io.ByteArrayOutputStream;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.ls.gpis.util.CommonUtil;

import ch.qos.logback.core.joran.conditional.ElseAction;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;

//엑셀 관련 서비스
@Service
public class ExcelService{
    
    protected Log log = LogFactory.getLog(this.getClass());


    //엑셀파일 정보를 반환한다.
    public ByteArrayOutputStream ExcelOut(List<HashMap<String, Object>> HeaderList, 
                                            List<HashMap<String, Object>> DataList) throws Exception
    {

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        
        SXSSFWorkbook workbook = new SXSSFWorkbook();                   //워크북 생성
    
        Sheet sheet = workbook.createSheet("Sheet1");         //시트 생성

        SheetInput(sheet, HeaderList, DataList);
        
        workbook.write(out);
        out.close();        
        workbook.close();    

        return out;
    }


    //엑셀 생성
    private void SheetInput(Sheet sheet, List<HashMap<String, Object>> HeaderList, List<HashMap<String, Object>> datas) {
    
        int rowNum = 0;
        
        Row Header_row = sheet.createRow(rowNum++);    //해더 생성
        int Header_cellNum = 0;
        for (Map<String, Object> HeadItem : HeaderList) {
            
            Cell cell = Header_row.createCell(Header_cellNum++);
            cell.setCellValue(HeadItem.get("text").toString());            
        }
        //해더 생성 끝

        //데이터를 한개씩 조회해서 한개의 행으로 만든다.
        for (Map<String, Object> data : datas) {
            //row 생성
            Row row = sheet.createRow(rowNum++);

            int cellNum = 0;
            for (Map<String, Object> HeadItem : HeaderList) {

                Cell cell = row.createCell(cellNum++);
                

                String HeaderKey = HeadItem.get("value").toString();
                String HeaderType = "";
                if(HeadItem.containsKey("type"))
                {
                    HeaderType = HeadItem.get("type") .toString();

                }

                if(data.containsKey(HeaderKey))
                {             
                    
                    if(CommonUtil.isNullOrEmpty(HeaderType))
                    {

                        if(data.get(HeaderKey) instanceof String)
                        {
                            
                            cell.setCellValue((String)data.get(HeaderKey));
    
                        }
                        else if(data.get(HeaderKey) instanceof Integer)
                        {
                            int temp = (Integer)data.get(HeaderKey);
    
                            cell.setCellValue((Integer)data.get(HeaderKey));
                        }
                        else if(data.get(HeaderKey) instanceof Double)
                        {
                            Double temp = (Double)data.get(HeaderKey);
                            cell.setCellValue((Double)data.get(HeaderKey));
                        }
                        else
                        {
                            cell.setCellValue(data.get(HeaderKey).toString());
                        }                    
                    }
                    else
                    {
                        if(HeaderType.equals("Double"))
                        {
                            String temp = data.get(HeaderKey).toString();                            
                            cell.setCellValue(Double.valueOf(temp));
                            
                        }
                        else
                        {
                            cell.setCellValue(data.get(HeaderKey).toString());
                        }
                    }

                }
                else
                {
                    cell.setCellValue("");
                }
                
            }        
        }
    }
    

}