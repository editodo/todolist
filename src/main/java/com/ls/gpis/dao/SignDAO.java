package com.ls.gpis.dao;

import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.*;

import com.ls.gpis.dto.MenuDTO;
import com.ls.gpis.dto.SignDTO;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Repository
public class SignDAO{

    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired 
    protected SqlSessionTemplate sqlSession;

    //신규 메뉴정보를 등록한다
   public int insertSign(final SignDTO signItem) throws Exception {
    return sqlSession.insert("com.ls.gpis.framework.sign.insertSign", signItem);
  }

  public int insertSignMember(final HashMap<String, Object> signItem) throws Exception {
    return sqlSession.insert("com.ls.gpis.framework.sign.insertSignMember", signItem);
  }
  
  // 결재정보를 수정한다.
  public int updateSign(final SignDTO signItem) throws Exception {
    return sqlSession.update("com.ls.gpis.framework.sign.updateSign", signItem);
  }

   // 결재자정보를 수정한다.
   public int updateSignMember(final SignDTO signItem) throws Exception {
    return sqlSession.update("com.ls.gpis.framework.sign.updateSignMember", signItem);
  }

  
  // 결재정보를 삭제한다.
  public int deleteSign(final int signId) throws Exception {
    return sqlSession.delete("com.ls.gpis.framework.sign.deleteSign", signId);
  }

   // 결재자정보를 삭제한다.
   public int deleteSignMember(final SignDTO signItem) throws Exception {
    return sqlSession.delete("com.ls.gpis.framework.sign.deleteSignMember", signItem);
  }

  
   // 결재자 전체를 삭제한다.
   public int deleteSignMemberList(final int signId) throws Exception {
    return sqlSession.delete("com.ls.gpis.framework.sign.deleteSignMemberList", signId);
  }

  // 결재 리스트를 반환한다.
  public List<SignDTO> selectSignList(String empUserId) throws Exception {
    return sqlSession.selectList("com.ls.gpis.framework.sign.selectSignList", empUserId);
  }

   // 결재자 리스트를 반환한다.
   public List<HashMap<String, Object>> selectSignMemberList(int signId) throws Exception {
    return sqlSession.selectList("com.ls.gpis.framework.sign.selectSignMemberList", signId);
  }

  public int updateMenuSignList(MenuDTO subMenu, String empUserId) {
    HashMap<String,Object> param = new HashMap<String,Object>();
        
    param.put("SIGN_ID", subMenu.getSign_id());
    param.put("empUserId", empUserId);
    param.put("MENU_ID", subMenu.getId());

    return sqlSession.update("com.ls.gpis.framework.sign.updateMenuSignList", param);
  }

}