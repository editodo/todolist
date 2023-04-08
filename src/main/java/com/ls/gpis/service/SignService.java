package com.ls.gpis.service;

import java.util.HashMap;
import java.util.List;

import com.ls.gpis.dao.SignDAO;
import com.ls.gpis.dto.MenuDTO;
import com.ls.gpis.dto.SignDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SignService {
    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private SignDAO signDAO;

    //신규결재정보를 등록한다.
    public int insertSign(SignDTO signItem)throws Exception
    {
        return signDAO.insertSign(signItem);
    }

    //신규결재자를 등록한다.
    public int insertSignMember(HashMap<String, Object> signItem)throws Exception
    {
        return signDAO.insertSignMember(signItem);
    }

    //결재정보를 수정한다.
    public int updateSign(SignDTO signItem)throws Exception
    {
        return signDAO.updateSign(signItem);
    }
    
    //결재자정보를 수정한다.
    public int updateSignMember(SignDTO signItem)throws Exception
    {
        return signDAO.updateSignMember(signItem);
    }

    //결재자전체를 수정한다.
    public int updateSignMemberList(int signId, String CREATER_ID, List<HashMap<String, Object>> signMemberList)throws Exception
    {
        int ORDER_NUM = 1;
        signDAO.deleteSignMemberList(signId);
         for (HashMap<String, Object> item : signMemberList) {
            item.put("SIGN_ID", signId);
            item.put("CREATER_ID", CREATER_ID);
            item.put("SIGN_USER_ID", item.get("EMP_USER_ID"));
            item.put("EMP_USER_ID", CREATER_ID);
            item.put("ORDER_NUM", ORDER_NUM);
            
            signDAO.insertSignMember(item); 
            ORDER_NUM++;
         }          
        
         return 1;  
    }

     //결재정보를 삭제한다.
     public int deleteSign(int signId)throws Exception
     {
         return signDAO.deleteSign(signId);
     }
     
     //결재자정보를 삭제한다.
     public int deleteSignMember(SignDTO signItem)throws Exception
     {
         return signDAO.deleteSignMember(signItem);
     }

    //사용자 결재정보를 반환한다.(메인 메뉴트리용)
    public List<SignDTO> selectSignList(String empUserId) throws Exception
    {
        List<SignDTO> Testlist = signDAO.selectSignList(empUserId);
        
        
        return Testlist;
    }

    

    //결재자정보를 반환한다.(메인 메뉴트리용)
    public List<HashMap<String, Object>> selectSignMemberList(int signId) throws Exception
    {
        List<HashMap<String, Object>> Testlist = signDAO.selectSignMemberList(signId);
        
        
        return Testlist;
    }

	public int updateMenuSignList(String empUserId, List<MenuDTO> menuSignList) {
        for (MenuDTO subMenu : menuSignList) {
            signDAO.updateMenuSignList(subMenu,empUserId);
            
            if(subMenu.getChildren() != null) 
                this.updateMenuSignList(empUserId, subMenu.getChildren());            
        }        
        
        return 0;
	}

}