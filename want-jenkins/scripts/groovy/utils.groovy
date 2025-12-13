def handleStage(Closure task, Closure onError = { msg -> error(msg) }) {
    try {
        echo "########## Call task() in stage '${env.STAGE_NAME}' ##########";
        task();
    } catch(Exception ex) {
        onError("Error in stage '${env.STAGE_NAME}': " + ex.toString());
    }
}

def bash(String path, String... args = []) {
    def command = path + " " + args.join(" ");
    sh('''#!/bin/sh +x
        echo " @ "''' + command + '''
        bash ''' + command + '''
    ''');
}

def printParams(Map params) {
    echo " @ Job parameters";
    params.each({param ->
        echo " > " + param.key + "=" + param.value;
    });
}

def jobState() {
    return currentBuild.currentResult;
}

def jobIsUnstable() {
    return jobState() == "UNSTABLE";
}

return this;
