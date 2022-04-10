export function repeatExecution(num, execution) {
    num--;
    return new Promise(function executor(resolve) {
        execution().then(function onComplete(res) {
            if (!res.ok && num > 0) {
                num--;
                return execution();
            }
            resolve(res);
        });
    });
}
