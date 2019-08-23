/**
 * @author              - Nathan Mersha
 * @copyright           - August 2019
 * @name                - Gennode ACM Middleware
 * @description         - Library for setting acm data
 */

class GennodeACM {

    /**
     * @name                    - Constructor
     * @description             - Gennode ACM library constructor
     * @param userConfig        - User configuration
     * @example
     * {
            host            : "localhost",
            port             : 3400,
            endpoint         : "/auth/token/validate",
            connection       : "http" // http call, seneca // todo future seneca support
       }
     */
    constructor(userConfig){
        // Binding methods
        this.mergeConfig = this.mergeConfig.bind(this);
        this.sendRequest = this.sendRequest.bind(this);

        this.debug      = require('debug')('Gennode-ACM-Middleware');
        this.request    = require('request');
        this.xtend      = require('xtend');
        this.exec       = require('child_process').exec;

        // Define default configuration
        this.defaultConfig = {
            host    : "localhost",
            port    : 3400,
            endpoint : "/auth/acm",
            connection : "http"
        };

        // Merge default configuration with the user's configuration.
        this.mergedConfig = this.mergeConfig(this.defaultConfig,userConfig);

        // ping authorization server and log status
        this.exec(`ping -c 1 ${this.mergedConfig.host.toString().replace("http://", "").replace("https://", "")}`, (error, stdout, stderr)=> {
            error || stderr ? this.debug(error, '\n\n', stderr, '\n', `Your authorization server may not be up at ${this.mergedConfig.host}`) : this.debug(stdout);
        });
    }

    /**
     * @name                    - Merge Config
     * @description             - Merges default config with user config.
     * @param defaultConfig     - Default Configuration
     * @param userConfig        - Input user configuration
     * @returns {*}             - Merged Configuration
     */
    mergeConfig(defaultConfig, userConfig){
        let mergedConfig = this.xtend(defaultConfig, userConfig);
        // Make message merge config if user has provided config message values.
        if(userConfig !== undefined){
            mergedConfig.message = this.xtend(defaultConfig.message, userConfig.message);
        }
        return mergedConfig;
    }

    /**
     * @name                    - Send request
     * @description             - Sends request
     * @param body              - Body to send
     * @param method            - Http Method
     * @param endPoint          - Endpoint
     * @param callback          - Callback function (error, response, body)
     */
    sendRequest(body, method, endPoint, callback){

        let options = option(method,body); // defines sending options
        this.request(endPoint,options,function (err,res,body) {
            callback(err,res,body)
        });

        /**
         * @name                - Option
         * @description         - Constructs option object
         * @param method        - Http Method
         * @param body          - Request body
         * @returns {{method: *, json: boolean, body: *}}
         */
        function option           (method,body)    {
            return {
                method : method, // defines the method PUT,GET,DELETE,REMOVE
                json : (body !== null), // defines true only when body data is available to attach
                body : body
            }
        }
    }

    /**
     * @name                    - Set ACM
     * @description             - Sets acm data
     * @param objectACM         - Object acm data
     * @param callback          - Callback function (error, response, body)
     */
    setACM(objectACM, callback){
        let objectACMKeys = Object.keys(objectACM);
        if(!objectACMKeys.includes("object")){
            throw new Error("Object acm must contain key object")
        }else if(!objectACMKeys.includes("accessControl")){
            throw new Error("Object acm must contain key accessControl");
        } else if(!objectACMKeys.includes("schemaName")){
            throw new Error("Object acm must contain key schemaName");
        }

        let constructedEndpoint = `http://${this.mergedConfig.host}${this.mergedConfig.port ? `:${this.mergedConfig.port}` : ""}${this.mergedConfig.endpoint}?createBy=object`;
        this.sendRequest(objectACM, "POST", constructedEndpoint, callback);
    }

}


module.exports = GennodeACM;