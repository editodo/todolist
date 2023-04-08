package com.ls.gpis.web;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.ls.gpis.annotation.AuthCheck;
import com.ls.gpis.annotation.AuthCheck.AuthLevel;
import com.ls.gpis.dto.CommonDTO;
import com.ls.gpis.service.BoardService;
import com.ls.gpis.service.LogService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

@AuthCheck(MENU_ID=10, LEVEL = AuthLevel.READ)
@RestController
@RequestMapping("/Qna")
public class QnaController {
    
    protected Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private BoardService boardService;

    @Autowired
    private LogService logService;

    private int Board_ID = 2;       //게시판 ID = 2(Qna)

    //게시물을 등록 한다.
    @AuthCheck(MENU_ID=10, LEVEL = AuthLevel.WRITE)
    @RequestMapping("/insertBoardData")
    public int insertBoardData(HttpServletRequest request,
        @RequestBody HashMap<String, Object> map
        )throws Exception
    {
        //로그인 정보를 바탕으로 작성자 정보를 생성한다.
        String UserID = request.getAttribute("UserID").toString();
        map.put("CREATER", UserID);

        //int bid = (int)map.get("B_ID");        
        return boardService.insertBoardContents(map, Board_ID);
    }

    //댓글을 등록한다.
    @AuthCheck(MENU_ID=10, LEVEL = AuthLevel.WRITE)
    @RequestMapping("/insertBoardComment")
    public CommonDTO insertBoardComment(HttpServletRequest request,
        @RequestBody HashMap<String, Object> map
        )throws Exception
    {
        return boardService.insertBoardComment(request, map, Board_ID);
    }

    //게시물 리스트를 반환한다.
    @RequestMapping("/selectBoardList")
    public List<HashMap<String, Object>> selectBoardList(
        @RequestBody HashMap<String, Object> map
        )throws Exception
    {
        return boardService.selectBoardList(Board_ID);
    }

    //댓글 리스트를 반환한다.
    @RequestMapping("/selectBoardCommentList")
    public List<HashMap<String, Object>> selectBoardCommentList(
        @RequestBody HashMap<String, Object> map
        )throws Exception
    {
        int OWNER_ID = Integer.parseInt(map.get("OWNER_ID").toString());;

        return boardService.selectBoardCommentList(Board_ID, OWNER_ID);
    }

    //게시물을 반환
    @RequestMapping("/selectBoardContents")
    public HashMap<String, Object> selectBoardContents(
        @RequestBody HashMap<String, Object> map
        )throws Exception
    {
        
        int cid = Integer.parseInt(map.get("cid").toString());;
        return boardService.selectBoardContents(cid, Board_ID);
    }

    //게시물을 삭제
    @AuthCheck(MENU_ID=10, LEVEL = AuthLevel.DELETE)     //삭제권한이 있는지 체크
    @RequestMapping("/deleteBoardContents")
    public CommonDTO deleteBoardContents(HttpServletRequest request, 
                                        @RequestBody HashMap<String, Object> ContentsInfo)throws Exception
    {    
        try{
            
            int cid = Integer.parseInt(ContentsInfo.get("CONTENTS_ID").toString()); //게시물 ID를 가져온다.
            return boardService.deleteBoardContents(request, ContentsInfo, cid, Board_ID);

        }catch (Exception e) {
            logService.insertErrorLog(request, e);            
            return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");
        }
    }

    //코멘트를 삭제한다.
    @AuthCheck(MENU_ID=10, LEVEL = AuthLevel.DELETE)     //삭제권한이 있는지 체크
    @RequestMapping("/deleteBoardComment")
    public CommonDTO deleteBoardComment(HttpServletRequest request, 
                                        @RequestBody HashMap<String, Object> ContentsInfo)throws Exception
    {    
        try{
            
            int CONTENTS_ID = Integer.parseInt(ContentsInfo.get("CONTENTS_ID").toString()); //게시물 ID를 가져온다.
            return boardService.deleteBoardContents(request, ContentsInfo, CONTENTS_ID, Board_ID);

        }catch (Exception e) {
            logService.insertErrorLog(request, e);            
            return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");
        }
    }


    //게시물을 수정한다.
    @AuthCheck(MENU_ID=10, LEVEL = AuthLevel.WRITE)     //작성 권한이 있는지 체크
    @RequestMapping("/updateBoardContents")
    public CommonDTO updateBoardContents(HttpServletRequest request, 
                                        @RequestBody HashMap<String, Object> ContentsInfo)throws Exception
    {    
        try{            
            int cid = Integer.parseInt(ContentsInfo.get("CONTENTS_ID").toString()); //게시물 ID를 가져온다.
            return boardService.updateBoardContents(request, ContentsInfo, cid, Board_ID);

        }catch (Exception e) {
            logService.insertErrorLog(request, e);            
            return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");
        }        
    }


    //코멘트 내용을 수정한다
    @AuthCheck(MENU_ID=10, LEVEL = AuthLevel.WRITE)     //작성 권한이 있는지 체크
    @RequestMapping("/updateBoardComment")
    public CommonDTO updateBoardComment(HttpServletRequest request, 
                                        @RequestBody HashMap<String, Object> ContentsInfo)throws Exception
    {    
        try{            
            int cid = Integer.parseInt(ContentsInfo.get("CONTENTS_ID").toString()); //게시물 ID를 가져온다.
            return boardService.updateBoardComment(request, ContentsInfo, cid, Board_ID);

        }catch (Exception e) {
            logService.insertErrorLog(request, e);            
            return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");
        }        
    }



}

