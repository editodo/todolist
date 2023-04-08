package com.ls.gpis.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ls.gpis.annotation.LoginCheck;
import com.ls.gpis.service.DeptService;
import com.ls.gpis.service.JwtService;
import com.ls.gpis.service.MenuService;
import com.ls.gpis.service.UserService;

import java.io.ByteArrayOutputStream;
import java.net.URLEncoder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;


import com.ls.gpis.service.*;


//공통 API호출용 컨트롤러
@RestController
@RequestMapping("/Common")
@LoginCheck
public class CommonController {

    protected Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private CompanyInfoService CompanyInfoService;
    
    @Autowired
    private CompanyBuyService CompanyBuyService;

    @Autowired
    private ExcelService excelService;

    @Autowired
    private ObjectMapper mapper;


    //부서리스트를 가져온다.    
    @RequestMapping("/CoperList")
    public List<HashMap<String,Object>> selectCoperList()throws Exception
    {    
        List<HashMap<String,Object>> coperList = null;

        coperList = CompanyInfoService.coperList();
        coperList.remove(0);    //전체 삭제


        return coperList;
    }

    //대분류 리스트를 가져온다.
    @RequestMapping("/product_group_list")
    public List<HashMap<String,Object>> product_group_list(@RequestBody HashMap<String, Object> map)throws Exception
    {    
        return CompanyBuyService.product_group_list2(map);
    }


    //사업장리스트를 가져온다.    
    @RequestMapping("/WorkPlaceList")
    public List<HashMap<String,Object>> selectWorkPlaceList(@RequestBody String coper)throws Exception
    {    
        List<HashMap<String,Object>> workplaceList = null;

        workplaceList = CompanyBuyService.workplaceList(coper);
        workplaceList.remove(0);    //전체 삭제


        return workplaceList;
    }


    //엑셀 파일을 다운로드 한다
    @RequestMapping("/ExcelDownload")
    public ResponseEntity<ByteArrayResource> ExcelDownload(@RequestBody HashMap<String, Object> map)throws Exception
    {            
        List<HashMap<String, Object>> HeaderList = mapper.convertValue(map.get("Header"), new TypeReference<List<HashMap<String, Object>>>() { });
        List<HashMap<String, Object>> DataList = mapper.convertValue(map.get("Data"), new TypeReference<List<HashMap<String, Object>>>() { });

        //엑셀파일을 생성한다.
        ByteArrayOutputStream byteStream = excelService.ExcelOut(HeaderList, DataList);         
        ByteArrayResource resource = new ByteArrayResource(byteStream.toByteArray());                
        String FileName = ConvStr("ExcelOutput.xlsx"); //파일명 한글깨짐 방지 처리
        

        return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + FileName )
        .contentType(new MediaType("application", "vnd.ms-excel")) //
        .contentLength(byteStream.size()) //
        .body(resource);
    }

    //파일명 한글깨짐 방지 처리
    private String ConvStr(String str)
    {

        //파일명 한글깨짐 방지 처리
        try{

            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < str.length(); i++) {
                char c = str.charAt(i);
                if (c > '~') {
                        sb.append(URLEncoder.encode("" + c, "UTF-8"));
                } else {
                        sb.append(c);
                }
            }
            String encodedFilename = sb.toString();
    
            return encodedFilename;
        }
        catch(Exception ex)
        {
            log.error(ex.getMessage(), ex);
        }
        
        return "";

    }
}
