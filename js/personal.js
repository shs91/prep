const CONTEXT_PATH = "https://www.eomg.net/admin/";
const strDash = "-";
const arrCbxNm = ['info_ch1','info_ch3'];

/**
 * 페이지 로드 시, keyup 이벤트 추가
 * @param : -
 * @return : -
 * */
function fn_load(){
	let blurArr = document.getElementById("frm").querySelectorAll("[data-blur='Y']");
	for (let i = 0; i < blurArr.length; i++) {
		blurArr[i].addEventListener('keyup', function (e) {
			// 숫자 체크
			if(!fn_number_chk(e.target.value)){
				alert("숫자가 아닙니다.\n\n0-9의 정수만 허용합니다.");
				e.target.value = "";
				e.target.focus();
			}
		});
	}
	
	document.querySelector("#term1").addEventListener('click',function(){
		toggleClass(document.querySelector(".term1_text"),"view");
	});

	document.querySelector("#term2").addEventListener('click',function(){
		toggleClass(document.querySelector(".term2_text"),"view");
	});

	document.querySelector("#term3").addEventListener('click',function(){
		toggleClass(document.querySelector(".term3_text"),"view");
	});

	// document.querySelector("#term4").addEventListener('click',function(){
	// 	toggleClass(document.querySelector(".term4_text"),"view");
	// });

	document.querySelector("#info_ch0").addEventListener('click',function(){
		if (this.checked) {
			document.querySelector("#info_ch1").checked = true;
			if(document.querySelector("#info_ch2")) document.querySelector("#info_ch2").checked = true;
			document.querySelector("#info_ch3").checked = true;
			if(document.querySelector("#info_ch4")) document.querySelector("#info_ch4").checked = true;
		} else {
			document.querySelector("#info_ch1").checked = false;
			if(document.querySelector("#info_ch2")) document.querySelector("#info_ch2").checked = false;
			document.querySelector("#info_ch3").checked = false;
			if(document.querySelector("#info_ch4")) document.querySelector("#info_ch4").checked = false;
		}
	});
	
	// 개별 체크박스 변경 시 전체 동의 체크박스 상태 업데이트
	function updateAllAgreeCheckbox() {
		const ch1 = document.querySelector("#info_ch1").checked;
		const ch2 = document.querySelector("#info_ch2") ? document.querySelector("#info_ch2").checked : false;
		const ch3 = document.querySelector("#info_ch3").checked;
		const ch4 = document.querySelector("#info_ch4") ? document.querySelector("#info_ch4").checked : false;
		
		// 모두 체크되어 있으면 전체 동의도 체크
		document.querySelector("#info_ch0").checked = (ch1 && ch2 && ch3 && ch4);
	}
	
	// 각 개별 체크박스에 이벤트 리스너 추가
	document.querySelector("#info_ch1").addEventListener('change', updateAllAgreeCheckbox);
	if(document.querySelector("#info_ch2")) document.querySelector("#info_ch2").addEventListener('change', updateAllAgreeCheckbox);
	document.querySelector("#info_ch3").addEventListener('change', updateAllAgreeCheckbox);
	if(document.querySelector("#info_ch4")) document.querySelector("#info_ch4").addEventListener('change', updateAllAgreeCheckbox);
}

/**
 * 페이지 validation 체크
 * @param : -
 * @return : -
 * */
function fn_validation_check(formId){
	let shouldSkip = false;
	let isValid = true;
	let frm = document.getElementById(formId);

 	// 텍스트의 필수값 체크
	let arrText = frm.querySelectorAll("input[type='text']");
	arrText.forEach(function(e){
		if(shouldSkip) {
			return;
		}
		// 필수값 체크
		if(e.dataset.req == "Y"){
			// 길이 체크
			if(e.value.length == 0){
				alert(e.dataset.msg);
				shouldSkip = true;
				isValid = false;
				e.focus();
			}
			// 이메일 주소 체크
			if(!shouldSkip && e.dataset.type == "mail" && !fn_mail_chk(e.value)){
				alert(e.dataset.msg);
				shouldSkip = true;
				isValid = false;
				e.focus();
			}
		}
	});

	if(shouldSkip) {
		return;
	}
	
	// 휴대폰 번호 필수값 체크
	if(!shouldSkip) {
		let phone2 = frm.querySelector("#phone2");
		let phone3 = frm.querySelector("#phone3");
		if(phone2 && phone2.value.length == 0) {
			alert("핸드폰 번호를 입력해주세요.");
			shouldSkip = true;
			isValid = false;
			phone2.focus();
		} else if(phone3 && phone3.value.length == 0) {
			alert("핸드폰 번호를 입력해주세요.");
			shouldSkip = true;
			isValid = false;
			phone3.focus();
		}
	}
	
	arrCbxNm.forEach(function (cbxNm){
		let cbxEl = frm.querySelector("input[name='"+cbxNm+"']");
		if(!cbxEl) return; // 요소가 없으면 스킵
		
		let chkCbxEl = frm.querySelectorAll("input[name='"+cbxNm+"']:checked");
		
		// 필수값인지, 체크했는지, 실제값이랑 원하는값이랑 같은지
		if(!shouldSkip && cbxEl.dataset.req == "Y" && 
				(chkCbxEl.length == 0 || (chkCbxEl[0] && chkCbxEl[0].dataset.reqVal != undefined && chkCbxEl[0].dataset.reqVal != chkCbxEl[0].value))){
			alert(cbxEl.dataset.msg);
			shouldSkip = true;
			isValid = false;
			cbxEl.focus();
		}
	});

	// 일반 메일 주소 체크 (회사메일이 필요)
	if(shouldSkip) {
		return;
	}

	let emailVal = document.getElementById("promEmail").value;
	const failMailArr = ["@hanmail.net","@empas.com","@gmail.com","@hotmail.com","@daum.net","@kakao.com"
		,"@naver.com","@dreamwiz.com","@freechal.com","@hanmir.com","@hanafors.com","@lycos.co.kr","@korea.com","@hitel.net"
		,"@nate.com","@msn.com","@paran.com"];
	failMailArr.forEach(function(currentValue, index, array) {
		// 실행할 코드
		if(emailVal.includes(currentValue)){
			alert("회사 메일로 등록을 요청 드립니다.");
			shouldSkip = true;
			isValid = false;
			document.getElementById("promEmail").focus();
		}
	});

	return isValid;
}

/**
 * 페이지 submit 체크
 * @param : -
 * @return : -
 * */
function fn_submit(formId) {
	if (!fn_validation_check(formId)) {
		return;
	}

	const urlParams = new URLSearchParams(window.location.search);
	const f = document.fom;
	f.promType.value = "cj01";
	f.promPhone.value = f.phone1.value + strDash + f.phone2.value + strDash + f.phone3.value;

	// 1. 관심 솔루션 (체크박스) -> promParam1에 저장
	var cbx1 = document.getElementsByName("promParam1_chk");
	var selectedOptions = [];
	for (var i = 0; i < cbx1.length; i++) {
		if (cbx1[i].type === "checkbox" && cbx1[i].checked) {
			selectedOptions.push(cbx1[i].value);
		}
	}
	f.promParam1.value = selectedOptions.join(",");

	// 2. 1:1 미팅 신청 여부 (체크박스) -> promParam2에 저장
	var cbx2 = document.getElementsByName("promParam2_chk");
	var selectedOptions = [];
	for (var i = 0; i < cbx2.length; i++) {
		if (cbx2[i].type === "checkbox" && cbx2[i].checked) {
			selectedOptions.push(cbx2[i].value);
		}
	}
	f.promParam2.value = selectedOptions.join(",");
	
	let isChecked = document.querySelector("input[name='info_ch2']:checked");
	f.promParam9.value = isChecked ? "동의" : "미동의";

	f.promParam10.value = urlParams.get('t');
	f.promParam10.value = f.promParam10.value.length == 0 ? "3rd" : f.promParam10.value;
	f.promFtpType.value = "cjolivenetworks/form01";
	f.subject.value = "AX INFRA & OPS 2026 에 관심 가져 주셔서 감사합니다.";
	f.sheetsId.value = "112sMMJyi4dLfSJm0ZK_tg9K3oUyjwB5f6clIqBtkJGE";
	f.sheetName.value = "data";
	// columnOrder: NO, 초청구분, 등록일자, 회사명, 이름, 직함, 부서명, 핸드폰, 이메일, 제3자 수신동의여부
	f.columnOrder.value = ['no','promParam10', 'cretDt','promCorpName','promName','promCorpTitle','promCorpDept','promPhone','promEmail','promParam9'];
	let url = CONTEXT_PATH + "api/promotion/regist/2.0/email"
	let frmData = $("#" + formId).serializeObject();
	// console.log(url, frmData);
	ajaxCall(url, frmData, true, true, sucHandler);
}

function sucHandler(result){
	alert(result.resultMsg);
	if(result.resultCd == "S") {
		location.reload();
		// location.href = "https://www.event-promotion.co.kr/isvevent/aws0621/thanks.html";
	}
}
