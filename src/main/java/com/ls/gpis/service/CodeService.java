package com.ls.gpis.service;

import java.util.HashMap;
import java.util.List;

import com.ls.gpis.dao.CodeDAO;
import com.ls.gpis.dto.CodeDTO;
import com.ls.gpis.dto.DetailCodeDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CodeService {
    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private CodeDAO codeDAO;

    //신규결재정보를 등록한다.
    public int insertCode(CodeDTO codeItem)throws Exception
    {
        return codeDAO.insertCode(codeItem);
    }

    //신규결재자를 등록한다.
    public int insertDetailCode(DetailCodeDTO detailCode)throws Exception
    {
        return codeDAO.insertDetailCode(detailCode);
    }

    //결재정보를 수정한다.
    public int updateCode(CodeDTO codeItem)throws Exception
    {
        return codeDAO.updateCode(codeItem);
    }
    
    //결재자정보를 수정한다.
    public int updateDetailCode(DetailCodeDTO codeItem)throws Exception
    {
        return codeDAO.updateDetailCode(codeItem);
    }

    //결재자전체를 수정한다.
    public int updateDetailCodeList(String groupCode, List<DetailCodeDTO> codeList)throws Exception
    {
        codeDAO.deleteDetailCodeList(groupCode);
         for (DetailCodeDTO item : codeList) {        
             codeDAO.insertDetailCode(item); 
         }  
         return 1;  
    }

     //결재정보를 삭제한다.
     public int deleteCode(String groupCode)throws Exception
     {
         codeDAO.deleteDetailCodeList(groupCode);
         return codeDAO.deleteCode(groupCode);
     }
     
     //결재자정보를 삭제한다.
     public int deleteDetailCode(DetailCodeDTO code)throws Exception
     {
         return codeDAO.deleteDetailCode(code);
     }

    //사용자 결재정보를 반환한다.(메인 메뉴트리용)
    public List<CodeDTO> selectCodeList(String groupCode) throws Exception
    {
        List<CodeDTO> Testlist = codeDAO.selectCodeList(groupCode);      
        
        return Testlist;
    }

    

    //결재자정보를 반환한다.(메인 메뉴트리용)
    public List<CodeDTO> selectDetailCodeList( DetailCodeDTO code) throws Exception
    {
        List<CodeDTO> Testlist = codeDAO.selectDetailCodeList(code);
        
        
        return Testlist;
    }


}