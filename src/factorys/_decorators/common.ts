// export function verifyContract(
//     target: any,
//     propertyKey: string,
//     descriptor: PropertyDescriptor
//   ) {
//     const originalMethod = descriptor.value;
  
//     descriptor.value = function (...args: any[]) {
//       /** Overriding Type */
//       const _this = this as any;
  
//       if (!_this.contract) {
//         throw new Error(`No import ${_this.contractName} contract`);
//       }
//       return originalMethod.apply(this, args);
//     };
  
//     return descriptor;
//   }
  