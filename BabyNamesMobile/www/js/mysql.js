var MySql = {
    _internalCallback : function() { console.log("Callback not set")},
    Execute: async function (Host, Username, Password, Database, Sql, Callback) {
        MySql._internalCallback = Callback;
        var strSrc = "https://mysql.cloud.wpcarey.asu.edu/api/babyNames/raw/";
        strSrc += "?sql=" + Sql;
        strSrc += "&Callback=MySql._internalCallback";
        console.log("Connecting to mysql.cloud.wpcarey.asu.edu..."); 
        
        // querying the db
        try {
            let resp = await fetch(strSrc);
            if (!resp.ok) {
                throw new Error("HTTP error, status code = " 
                    + resp.status + '. ' + resp.Error);
            }
            let json = await resp.json();
            console.log(`Query successful: ${json.Success}`);
            console.log(`Query result: ${JSON.stringify(json.Result)}`);
            if (!json.Success) {
                console.log(`Error: ${json.Error}`)
            } 
            MySql._internalCallback(json);
        } catch (error) {
            alert(error);
        }
    }
};