import React from 'react';
import LegalDoc from '../components/LegalDoc';
import { COMPANY, SUPPORT_EMAIL } from '../config';

// editodo.com/delete-account: the public "how to delete your account" page Google Play asks for.
const sections = [
    ['', `EdiTodo(제공: ${COMPANY}) 계정과 데이터를 삭제하는 방법을 안내합니다.`],
    ['앱에서 직접 삭제', `1. EdiTodo 앱(또는 https://editodo.com)에 로그인합니다.
2. 하단 [마이페이지] 탭을 엽니다.
3. 화면 맨 아래 [회원 탈퇴]를 누르고 확인합니다.

탈퇴는 즉시 처리됩니다.`],
    ['메일로 삭제 요청', `앱을 사용할 수 없는 경우 ${SUPPORT_EMAIL} 로 가입한 아이디(또는 가입 이메일)를 적어 삭제를 요청해 주세요. 본인 확인 후 7일 이내에 삭제하고 결과를 회신합니다.`],
    ['삭제되는 데이터', `- 계정 정보: 아이디, 닉네임, 이메일, 비밀번호(암호화된 값)
- 작성한 모든 할 일, 하루 기록(일기), 스티커
- 테마·글꼴·언어·알림 등 설정
- 카카오·Google·Apple 로그인 연결 정보 (해당 서비스에 연결 해제를 함께 요청합니다)

삭제된 데이터는 복구할 수 없습니다.`],
    ['보관되는 데이터', `법령에 따라 보존해야 하는 정보가 있는 경우에만 해당 기간 동안 분리 보관한 뒤 파기합니다. 오류 기록에는 이용자를 식별할 수 있는 정보가 포함되지 않습니다.
로그인 없이 사용한 임시 계정은 1년 동안 사용하지 않으면 자동으로 삭제됩니다.`],
];

export default function AccountDeletionScreen({ navigation }) {
    return <LegalDoc navigation={navigation} title="계정 삭제 안내" effectiveDate="2026년 10월 21일" sections={sections} />;
}
