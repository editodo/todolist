package com.ls.gpis.web;

import java.io.Console;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.ls.gpis.annotation.AuthCheck;
import com.ls.gpis.annotation.LoginCheck;
import com.ls.gpis.annotation.AuthCheck.AuthLevel;
import com.ls.gpis.service.CompanyBuyService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;



@AuthCheck(MENU_ID=301, LEVEL = AuthLevel.READ)
@RestController
@RequestMapping("/companybuylist")
public class CompanyBuyController {
    
    protected Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private CompanyBuyService companyBuyService;


    //게시물 리스트를 반환한다.
    @RequestMapping("/selectCompanyBuyList")
    public List<HashMap<String, Object>> selectCompanyBuyList(HttpServletRequest request,
        @RequestBody HashMap<String, Object> map
        )throws Exception
    {
        List<String> search_text_List = new ArrayList<String>();
        //String searchText = request.getAttribute("searchText").toString();
        String searchText = (String)map.get("searchText");

        if(searchText != null){
            searchText = searchText.toString().replace(" ", ",");
            String[] array = searchText.split(",");
            if(!searchText.equals("")){
                if(array.length == 0){
                    search_text_List.add(searchText);
                }else{
                    for(int i = 0; i< array.length; i++){
                        search_text_List.add(array[i]);
                    }
                }
            }
        }else{
            searchText = "";
        }
                
        map.put("search_text_List", search_text_List);

        List<HashMap<String, Object>>  rslt = new ArrayList<HashMap<String, Object>>();

        if(!searchText.equals("")){
            rslt = companyBuyService.selectCompanyBuyList(map);
        }

        return rslt;
    }

    @RequestMapping("/selectCompanyBuyListNew")
    public List<HashMap<String, Object>> selectCompanyBuyListNew(HttpServletRequest request,
        @RequestBody HashMap<String, Object> map
        )throws Exception
    {
        List<String> search_text_List = new ArrayList<String>();
        List<String> search_country_List = new ArrayList<String>();
        List<String> search_country_ListNew = new ArrayList<String>();
        ArrayList <HashMap<String,Object>> list = new ArrayList<HashMap<String,Object>>();
        //String searchText = request.getAttribute("searchText").toString();
        String searchText = (String)map.get("searchData");
        String searchText1 = (String)map.get("searchData1");

        if(searchText != null){
            searchText = searchText.toString().replace(" ", ",");
            String[] array = searchText.split(",");
            if(!searchText.equals("")){
                if(array.length == 0){
                    search_text_List.add(searchText);
                }else{
                    for(int i = 0; i< array.length; i++){
                        search_text_List.add(array[i]);
                    }
                }
            }
        }else{
            searchText = "";
        }
        
        list = (ArrayList)map.get("IN_COUNTRY");  
        for(int i = 0; i< list.size(); i++){
            try{
                //search_country_List.add(list.get(i).get("IN_COUNTRY").toString());
                search_country_List.add(String.valueOf(list.get(i)));
            }catch(Exception ex){
                //아마 여기로 올일은 없을것...
                log.error(ex);
                search_country_List.add(String.valueOf(list.get(i)));
            }
        }

        map.put("searchText", searchText);
        map.put("search_text_List", search_text_List);
        map.put("search_text_List1", searchText1);
        map.put("search_country_List", search_country_List);

        List<HashMap<String, Object>>  rslt = new ArrayList<HashMap<String, Object>>();
        if(!searchText.equals("") || (!map.get("CORPORATE_ID").toString().equals("전체")
        || list.size() != 0
        || !map.get("PRODUCT_GROUP").toString().equals("전체")
        || !map.get("PRODUCT_CLASS").toString().equals("전체")
        || !map.get("IN_COMPANY_NAME").toString().equals(""))){
            rslt = companyBuyService.selectCompanyBuyList(map);
        }
        return rslt;
    }

    @RequestMapping("/selectCompanyBuyCompanyList")
    public List<HashMap<String, Object>> selectCompanyBuyCompanyList(HttpServletRequest request,
        @RequestBody HashMap<String, Object> map
        )throws Exception
    {
        
        List<HashMap<String, Object>>  rslt = companyBuyService.selectCompanyBuyCompanyList(map);
        
        return rslt;
    }

    @RequestMapping("/selectCompanyInfoList")
    public List<HashMap<String, Object>> selectCompanyInfoList(HttpServletRequest request,
        @RequestBody HashMap<String, Object> map
        )throws Exception
    {
        
        List<HashMap<String, Object>>  rslt = companyBuyService.selectCompanyInfoList(map);
        
        return rslt;
    }

    @RequestMapping("/coperList")
    public List<HashMap<String, Object>> coperList(HttpServletRequest request
        )throws Exception
    {
        List<HashMap<String, Object>>  rslt = new ArrayList<HashMap<String, Object>>();
        
        rslt = companyBuyService.coperList();
        
        return rslt;
    }

    @RequestMapping("/workplaceList")
    public List<HashMap<String, Object>> workplaceList(HttpServletRequest request,
    @RequestBody String coper    )throws Exception
    {
        coper = coper.replace("=", "");
        List<HashMap<String, Object>>  rslt = new ArrayList<HashMap<String, Object>>();
        
        rslt = companyBuyService.workplaceList(coper);
        
        return rslt;
    }

    @RequestMapping("/countryList")
    public List<HashMap<String, Object>> countryList(HttpServletRequest request
        )throws Exception
    {
        List<HashMap<String, Object>>  rslt = new ArrayList<HashMap<String, Object>>();
        
        rslt = companyBuyService.countryList();
        
        return rslt;
    }

    @RequestMapping("/product_group_list")
    public List<HashMap<String, Object>> product_group_list(HttpServletRequest request
    ,@RequestBody HashMap<String, Object> map )throws Exception
    {
        List<HashMap<String, Object>>  rslt = new ArrayList<HashMap<String, Object>>();
        
        rslt = companyBuyService.product_group_list(map);
        
        return rslt;
    }

    @RequestMapping("/product_class_list")
    public List<HashMap<String, Object>> product_class_list(HttpServletRequest request
     ,@RequestBody HashMap<String, Object> map  )throws Exception
    {
        List<HashMap<String, Object>>  rslt = new ArrayList<HashMap<String, Object>>();
        
        rslt = companyBuyService.product_class_list(map);
        
        return rslt;
    }

    @RequestMapping("/product_subclass_list")
    public List<HashMap<String, Object>> product_subclass_list(HttpServletRequest request,
    @RequestBody HashMap<String, Object> map    )throws Exception
    {
        List<HashMap<String, Object>>  rslt = new ArrayList<HashMap<String, Object>>();
       
        rslt = companyBuyService.product_subclass_list(map);
        
        return rslt;
    }
}

