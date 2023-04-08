<template>
  <div class="list-table">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
			<div class="wd-per-100">
				<div class="tb-wrap type04">
					<table class="tb-st">
						<caption class="screen-out">고객송장 전표 작성</caption>
						<colgroup>
							<col width="13%">
							<col width="20%">
							<col width="13%">
							<col width="20%">
							<col width="13%">
							<col width="20%">
						</colgroup>
						<tbody>
							<tr>
								<th scope="row">전표유형</th>
								<td>
									[DR] 고객송장
									<input type="hidden" id="BLART" name="BLART" value="DR">
									<input type="hidden" id="BLART_NM" name="BLART_NM" value="[DR] 고객송장">
								</td>
								<th scope="row">증빙일자</th>
								<td>
									<div>
										<input type="text" class="inp-comm datePic bldat" title="증빙일자" id="BLDAT" name="BLDAT" value="2019-12-06" readonly="readonly">
										<input type="hidden" id="ZFBDT" name="ZFBDT" value="2019-12-06">
									</div>
								</td>
								<th scope="row">전기일자</th>
								<td>
									<div>
										<input type="text" class="inp-comm datePic budat" title="전기일자" id="BUDAT" name="BUDAT" value="2019-12-06" readonly="readonly">
									</div>
								</td>
							</tr>
							<tr>
								<th scope="row">총 금액</th>
								<td>
									<div class="inp-wrap type02" style="width:100%;">
										<input type="text" class="inpTxt ar price" id="WRBTR" name="WRBTR" style="text-align: right;" title="금액" maxlength="14" onblur="fn_calculateNoEnterAmount(this); return false;">
									</div>
								</td>
								<th scope="row">총 공급가액</th>
								<td>
									<div class="inp-wrap type02" style="width:100%;">
										<input type="text" class="inpTxt ar price" id="WRBTR1" name="WRBTR1" style="text-align: right;" title="금액" maxlength="14" onblur="fn_calculateNoEnterAmount(this); return false;">
									</div>
								</td>
								<th scope="row">총 부가세액</th>
								<td>
									<div class="inp-wrap type02" style="width:100%;">
										<input type="text" class="inpTxt ar price" id="FWBAS" name="FWBAS" style="text-align: right;" title="금액" maxlength="14" onblur="fn_calculateNoEnterAmount(this); return false;">
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="tb-wrap type04 mgn-t-10">
					<table class="tb-st">
						<caption class="screen-out">전표HEADER</caption>
						<colgroup>
							<col width="13%">
							<col width="20%">
							<col width="13%">
							<col width="20%">
							<col width="13%">
							<col width="20%">
						</colgroup>
						<tbody>
							<tr>
								<th scope="row">사업장</th>
								<td>
									<div class="sel-wrap">
										<select title="부가세사업장" id="BUPLA" name="BUPLA">
											
												<option value="1000">(1000) 엘에스니꼬 온산본사</option>
											
												<option value="2000">(2000) 엘에스니꼬 장항공장</option>
											
												<option value="3000">(3000) 엘에스니꼬 판교사무소</option>
											
												<option value="8000">(8000) 엘에스니꼬 서울사무소</option>
											
										</select>
									</div>
									<input type="hidden" id="BUPLA_NM" name="BUPLA_NM" value="">
								</td>
								<th scope="row">세금코드<span style="color: blue;">(필수확인)</span></th>
								<td>
									<div id="selMwskzDR" class="sel-wrap selMwskz">
										<select id="MWSKZ" name="MWSKZ">
	<option value="11" data-deduction="null">매출10%</option>
	<option value="12" data-deduction="null">매출0%</option>
	<option value="21" data-deduction="null">매출계산서0%</option>
	</select>

									</div>
								</td>
								<th scope="row">통화</th>
								<td>
									<div class="wd-per-25 f-l">
										<div class="inp-wrap">
											<input type="text" class="inp-comm" title="통화" id="WAERS" name="WAERS" maxlength="3" placeholder="통화 입력" readonly="readonly" onclick="fn_waersList(this); return false;"> 
										</div>
									</div>
									<div class="wd-per-40 f-l">
										<div class="inp-wrap mgn-l-5 wd-mgn-del">
											<input type="text" class="inpTxt ar price" title="환율" id="KURSF" name="KURSF" style="text-align: right;" placeholder="환율" readonly="readonly"> 
										</div>
									</div>
									<div class="wd-per-35 f-l">
										<div class="mgn-l-5 wd-mgn-del">
											<input type="text" class="mgn-t-5" id="gdatu" readonly="readonly">
										</div>
									</div>
								</td>
							</tr>
							<tr>
								<th scope="row">고객</th>
								<td colspan="5">
									<div class="inp-wrap f-l wd-per-23">
										<input type="text" class="inp-comm" title="구매처1" id="LIFNR_1_NM" name="LIFNR_1_NM" placeholder="클릭하여 조회" readonly="readonly" onclick="fn_VendorList(this,'4'); return false;">
										<input type="hidden" id="LIFNR_1" name="LIFNR_1" value="">
										<input type="hidden" id="STCD2" name="STCD2" value="">
									</div>
								</td>
							</tr>
	<!-- 											<tr> -->
	<!-- 												<th scope="row">은행명</th> -->
	<!-- 												<td id="bank_td"> -->
	<!-- 													<input type="hidden" id="BANKA" name="BANKA" value="" /> -->
	<!-- 													<input type="hidden" id="BANKS" name="BANKS" value="" /> -->
	<!-- 													<input type="hidden" id="BANKL" name="BANKL" value="" /> -->
	<!-- 												</td> -->
	<!-- 												<th scope="row">계좌번호</th> -->
	<!-- 												<td id="account_td"> -->
	<!-- 													<input type="hidden" id="BANKN" name="BANKN" value="" /> -->
	<!-- 													<input type="hidden" id="BKONT" name="BKONT" value="" /> -->
	<!-- 													<input type="hidden" id="BKREF" name="BKREF" value="" /> -->
	<!-- 												</td> -->
	<!-- 												<th scope="row">대체수취인</th> -->
	<!-- 												<td id="empfk_td"> -->
	<!-- 												</td> -->
	<!-- 											</tr> -->
							<tr>
	<!-- 												<th scope="row">입금방법</th> -->
	<!-- 												<td> -->
	<!-- 													<input type="hidden" id="ZWELS" name="ZWELS" value="" /> -->
	<!-- 													<span class="zwels"> -->
	<!-- 													</span> -->
	<!-- 												</td> -->
								<th scope="row">조정계정</th>
								<td id="rcAccount_td">
								</td>
								<th scope="row">입금조건</th>
								<td>
									<div class="inp-wrap f-l wd-per-100">
										<input type="text" class="inp-comm" title="지급조건" id="ZTERM_NM" name="ZTERM_NM" placeholder="클릭하여 조회" readonly="readonly" onclick="fn_ztermList('D'); return false;">
										<input type="hidden" id="ZTERM" name="ZTERM" value="">
									</div>
								</td>
								<th scope="row">입금예정일</th>
								<td id="netdt_td">
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				
				<div class="mgn-t-10" style="width: 100%;">
					<a href="#none" class="btn comm st02" onclick="fn_addAttach(); return false;">첨부</a>
				</div>
				<div class="viewAttachLstWrap overflow mgn-t-5">
					<div class="f-l wd-per-50">
						<div class="viewAttachLstTit">파일첨부</div>
						<ul class="viewAttachLst" id="attachFileList">
						
						</ul>
					</div>
					<div class="f-l wd-per-50">
						<div class="viewAttachLstTit type02">품의서첨부</div>
						<ul class="viewAttachLst type02" id="attachConList">
						
						</ul>
					</div>
				</div>
			</div>


        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

