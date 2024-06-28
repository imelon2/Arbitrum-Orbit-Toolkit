export function LogFinishTime(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
        const result = await originalMethod.apply(this, args); // 비동기 함수 실행 및 결과 기다리기
        const finishTime = new Date(); // 함수 실행 완료 시점의 현재 시간
        console.log(`[Log] ${(this as any).contractName}.${propertyKey}() finished at ${finishTime.toLocaleString()}`);
        return result;
    };

    return descriptor;
}