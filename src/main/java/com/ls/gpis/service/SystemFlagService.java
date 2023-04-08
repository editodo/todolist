package com.ls.gpis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ls.gpis.dao.CommonDAO;
import com.ls.gpis.dao.SystemFlagDAO;
import com.ls.gpis.dto.CommonDTO;
import com.ls.gpis.util.CommonUtil;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class SystemFlagService {

    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired
    private SystemFlagDAO systemFlagDAO;
    
    @Autowired
    private CommonDAO commonDAO;

    @Autowired
    private LogService logService;

    //시스템 플래그 리스트를 반환한다.
    public List<HashMap<String,Object>> selectSystemFlagList(HashMap<String,Object> SearchCond)throws Exception 
    {
        return systemFlagDAO.selectSystemFlagList(SearchCond);
    }

    //시스템 플래그 상세 정보를 반환한다.
    public HashMap<String,Object> selectSystemFlag(HashMap<String,Object> SearchCond)throws Exception 
    {
        return systemFlagDAO.selectSystemFlag(SearchCond);
    }
    
    //시스템 플래의 명칭의 리스트를 반환한다.
    public List<HashMap<String,Object>> selectFLAG_NAMEList(HashMap<String,Object> SearchCond)throws Exception 
    {
        return systemFlagDAO.selectFLAG_NAMEList(SearchCond);
    }



    //시스템 플래그를 등록한다.
    public CommonDTO insertSystemFlag(HttpServletRequest request, HashMap<String, Object> FlagData)throws Exception 
    {        
        CommonDTO ret = new CommonDTO(false, "오류가 발생 하였습니다.");

        try
        {   
            //사용자 정보 등록 
            String UserID = request.getAttribute("UserID").toString();  //접속 ID정보를 받아온다.            
            FlagData.put("CREATER_ID", UserID);                         //MAP에다가 접속ID를 집어 넣는다.
            
            //시퀀스를 통해서 ID값을 가져온다.
            //int seq = commonDAO.selectGetSEQ("S_SYSTEM_FLAG");
            //FlagData.put("SYSTEM_FLAG_ID", seq);  

            //벨리데이션 체크를 진행한다.            
            CommonDTO ValRet = ValidateSystemFlag(FlagData);
            if(ValRet.getRet() == false) return ValRet;

            //DB에 등록한다.
            int cnt = systemFlagDAO.insertSystemFlag(FlagData);

            if(cnt == 1) 
            {
                //메시지를 셋팅후 반환
                ret.setRet(true);                   //결과(성공)
                ret.setMsg("저장 되었습니다.");     //메시지 셋팅
                return ret;
            }

            //여기로 왔으면 저장 안된거임...
        }
        catch(Exception ex)
        {
            logger.error(ex.getMessage());              //에러 메시지를 기록            
            logService.insertErrorLog(request, ex);     //DB 로그에 기록
            return ret;
        }

        return ret;
    }


    //시스템 플래그 정보를 수정한다.
    public CommonDTO updateSystemFlag(HttpServletRequest request, HashMap<String, Object> FlagData)throws Exception 
    {
        CommonDTO ret = new CommonDTO(false, "오류가 발생 하였습니다.");

        try
        {
            //벨리데이션 체크를 진행한다.            
            CommonDTO ValRet = ValidateSystemFlag(FlagData);
            if(ValRet.getRet() == false) return ValRet;
            
            //사용자 정보 등록 
            String UserID = request.getAttribute("UserID").toString();  //접속 ID정보를 받아온다.            
            FlagData.put("UPDATE_ID", UserID);                         //MAP에다가 접속ID를 집어 넣는다.

            //DB에 저장한다.
            int cnt = systemFlagDAO.updateSystemFlag(FlagData);    
            if(cnt == 1)    //성공
            {
                //메시지를 셋팅후 반환
                ret.setRet(true);                   //결과(성공)
                ret.setMsg("저장 되었습니다.");     //메시지 셋팅
                return ret;
            }
        }
        catch(Exception ex)
        {
            logger.error(ex.getMessage());              //에러 메시지를 기록            
            logService.insertErrorLog(request, ex);     //DB 로그에 기록
            return ret;
        }

        return ret;
    }

    //시스템 플래그 정보를 삭제한다.
    public CommonDTO deleteSystemFlag(HttpServletRequest request, HashMap<String, Object> FlagData)throws Exception 
    {
        CommonDTO ret = new CommonDTO(false, "오류가 발생 하였습니다.");

        try
        {
            int cnt = systemFlagDAO.deleteSystemFlag(FlagData);    
            if(cnt == 1)    //성공
            {
                //메시지를 셋팅후 반환
                ret.setRet(true);                   //결과(성공)
                ret.setMsg("삭제 되었습니다.");     //메시지 셋팅
                return ret;
            }
        }
        catch(Exception ex)
        {
            logger.error(ex.getMessage());              //에러 메시지를 기록            
            logService.insertErrorLog(request, ex);     //DB 로그에 기록
            return ret;
        }

        return ret;
    }



    //벨리데이션 체크
    public CommonDTO ValidateSystemFlag(HashMap<String, Object> FlagData)throws Exception 
    {
        //1. 필수값 체크
        String flag_name = FlagData.get("FLAG_NAME").toString();

        if(CommonUtil.isNullOrEmpty(flag_name) == true)
        {
            return new CommonDTO(false, "FLAG 명을 입력하여 주시기 바랍니다.");
        }
        
        String flag_code = FlagData.get("FLAG_CODE").toString();
        if(CommonUtil.isNullOrEmpty(flag_code) == true)
        {
            return new CommonDTO(false, "FLAG 코드를 입력하여 주시기 바랍니다.");
        }

        String flag_data = FlagData.get("FLAG_DATA").toString();
        if(CommonUtil.isNullOrEmpty(flag_data) == true)
        {
            return new CommonDTO(false, "FLAG DATA를 입력하여 주시기 바랍니다.");
        }

        
        //2. FLAG_NAME과 FLAG_CODE가 동일한게 있는지 확인한다(단, SYSTEM_FLAG_ID가 같다면 허용한다.)
        List<HashMap<String,Object>> list = systemFlagDAO.selectSystemFlagList(FlagData);
        if(list.size() >= 1)
        {
            HashMap<String,Object> item = list.get(0);
            int orgSystemFlagID = (int)item.get("SYSTEM_FLAG_ID");


            int newsystemFlagID = (int)FlagData.get("SYSTEM_FLAG_ID");
            if(orgSystemFlagID != newsystemFlagID)
            {
                return new CommonDTO(false, "중복된 시스템 코드가 있습니다.");
            }
        }

        return new CommonDTO(true, "벨리데이션 통과");
    }

}

