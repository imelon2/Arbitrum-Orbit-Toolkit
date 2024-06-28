import { LogFinishTime } from "../src/factorys/_decorators/common";

class ContractHandler {
    contract: any = null;
    contractName: string = "ExampleContract1234"; // 이 속성이 클래스에 존재하는지 확인

    constructor(contract?: any) {
        this.contract = contract;
    }

    @LogFinishTime
    init() {
        console.log("Initializing contract...");
    }
}

function checkContract(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
        
        const _this = this as ContractHandler
        console.log(_this.contractName);
        // if (!_this.contract) {
        //     throw new Error(`No import ${_this.contractName} contract`);
        // }
        return originalMethod.apply(_this, args);
    };

    return descriptor;
}


function checkContract1() {
    // console.log(a.this);
    
    // descriptor.value는 test() 함수 자체를 가리킨다. 이 함수를 잠시 변수에 피신 시킨다.
    
    return function (target: any, property: string, descriptor: PropertyDescriptor) {
        let originMethod = descriptor.value; 
        // 그리고 기존의 test() 함수의 내용을 다음과 같이 바꾼다.
        descriptor.value = function (...args: any) {
            console.log('before');
            console.log(this as ContractHandler);
            
            const _this = this as ContractHandler
            //   console.log(this.contractName as ContractHandler);
            
            originMethod.apply(this, args); // 위에서 변수에 피신한 함수를 call, apply, bind 를 통해 호출
            console.log('after');
            //   console.log(this.value.contractName);
            
        };
    };
}

// 사용 예제
const handler = new ContractHandler();
handler.init();  // 'this.contract' 상태에 따라 에러를 던지거나 초기화 메시지를 출력