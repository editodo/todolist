package com.ls.gpis.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import com.ls.gpis.dto.CommonDTO;

import com.ls.gpis.annotation.AuthCheck;
import com.ls.gpis.annotation.LoginCheck;
import com.ls.gpis.annotation.AuthCheck.AuthLevel;
import com.ls.gpis.service.CompanyInfoService;
import com.ls.gpis.service.LogService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;



@AuthCheck(MENU_ID=302, LEVEL = AuthLevel.READ)
@RestController
@RequestMapping("/companyInfolist")
public class CompanyInfoController {
    
    protected Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private CompanyInfoService companyInfoService;

    @Autowired
    private LogService logService;

    @RequestMapping("/selectCompanyInfoList")
    public List<HashMap<String, Object>> selectCompanyInfoList(HttpServletRequest request,
        @RequestBody HashMap<String, Object> map
        )throws Exception
    {
        String searchText = (String)map.get("searchText");
        
        List<HashMap<String, Object>>  rslt = companyInfoService.selectCompanyInfoList(map);
        
        return rslt;
    }

    @RequestMapping("/selectCompanyInfoListScore")
    public List<HashMap<String, Object>> selectCompanyInfoListScore(HttpServletRequest request,
        @RequestBody HashMap<String, Object> map
        )throws Exception
    {
        List<HashMap<String, Object>>  rslt = companyInfoService.selectCompanyInfoListScore(map);
        
        return rslt;
    }
    

    @RequestMapping("/coperList")
    public List<HashMap<String, Object>> coperList(HttpServletRequest request
        )throws Exception
    {
        List<HashMap<String, Object>>  rslt = new ArrayList<HashMap<String, Object>>();
        
        rslt = companyInfoService.coperList();
        
        return rslt;
    }

    @RequestMapping("/estimationList")
    public List<HashMap<String, Object>> estimationList(HttpServletRequest request, 
    @RequestBody HashMap<String, Object> map
        )throws Exception
    {
        List<HashMap<String, Object>>  rslt = new ArrayList<HashMap<String, Object>>();
        
        rslt = companyInfoService.estimationList(map);
        
        return rslt;
    }

    @RequestMapping("/estimationGraph")
    public List<HashMap<String, Object>> estimationGraph(HttpServletRequest request, 
    @RequestBody HashMap<String, Object> map
        )throws Exception
    {
        List<HashMap<String, Object>>  rslt = new ArrayList<HashMap<String, Object>>();
        
        rslt = companyInfoService.estimationGraph(map);
        
        return rslt;
    }

    

    @RequestMapping("/selectIssueList")
    public List<HashMap<String, Object>> selectIssueList(HttpServletRequest request, 
    @RequestBody HashMap<String, Object> map
        )throws Exception
    {
        List<HashMap<String, Object>>  rslt = new ArrayList<HashMap<String, Object>>();
        
        rslt = companyInfoService.selectIssueList(map);
        
        return rslt;
    }

    @RequestMapping("/updateIssue")
    public CommonDTO updateCoper(HttpServletRequest request, @RequestBody HashMap<String, Object> CoperInfo)throws Exception{    

        try{
            String UserID = request.getAttribute("UserID").toString();
            CoperInfo.put("UPDATER_ID", UserID);            
            CoperInfo.put("CREATER_ID", UserID);            

            if(companyInfoService.updateIssue(CoperInfo) == 1)
            {
                if(CoperInfo.get("COMPANY_ISSUE_ID").equals("")){
                    return new CommonDTO(true, "정상적으로 저장 되었습니다.");    
                }else{
                    return new CommonDTO(true, "정상적으로 수정 되었습니다.");    
                }
                
            }
            return new CommonDTO(false, "문제가 발생 하였습니다.");    
        }catch (Exception e) {
            logService.insertErrorLog(request, e);            
            return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");
        }
    }

    @RequestMapping("/deleteIssue")
    public CommonDTO deleteIssue(HttpServletRequest request,
                                        @RequestBody HashMap<String, Object> CoperInfo)throws Exception
    {
        try{
            String UserID = request.getAttribute("UserID").toString();
            CoperInfo.put("UPDATER_ID", UserID);            
            CoperInfo.put("CREATER_ID", UserID);            

            if(companyInfoService.deleteIssue(CoperInfo) == 1)
            {
                return new CommonDTO(true, "정상적으로 삭제 되었습니다.");    
            }
            return new CommonDTO(false, "문제가 발생 하였습니다.");    
        }catch (Exception e) {
            logService.insertErrorLog(request, e);            
            return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");
        }

    }
    
}

