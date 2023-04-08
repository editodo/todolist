package com.ls.gpis.web;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.ls.gpis.annotation.AuthCheck;
import com.ls.gpis.annotation.AuthCheck.AuthLevel;
import com.ls.gpis.annotation.LoginCheck;
import com.ls.gpis.service.BoardService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;




@AuthCheck(MENU_ID=9, LEVEL = AuthLevel.READ)
@RestController
@RequestMapping("/help")
public class HelpController {
    
    protected Log log = LogFactory.getLog(this.getClass());

    private static int B_ID = 0;

    @Autowired
    private BoardService boardService;

    //게시물을 등록 한다.
    @AuthCheck(MENU_ID=9, LEVEL = AuthLevel.WRITE)
    @RequestMapping("/insertBoardData")
    public int insertBoardData(HttpServletRequest request,
        @RequestBody HashMap<String, Object> map
        )throws Exception
    {
        //로그인 정보를 바탕으로 작성자 정보를 생성한다.
        String UserID = request.getAttribute("UserID").toString();
        map.put("CREATER", UserID);
                
        return boardService.insertBoardContents(map, B_ID);
    }

    //게시물 리스트를 반환한다.
    @RequestMapping("/selectBoardList")
    public List<HashMap<String, Object>> selectBoardList(
        @RequestBody HashMap<String, Object> map
        )throws Exception
    {
                
        return boardService.selectBoardList(B_ID);
    }


    //게시물을 반환
    @RequestMapping("/selectBoardContents")
    public HashMap<String, Object> selectBoardContents(
        @RequestBody HashMap<String, Object> map
        )throws Exception
    {
                
        int cid = Integer.parseInt(map.get("cid").toString());;
        return boardService.selectBoardContents(cid, B_ID);
    }


}

