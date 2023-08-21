class SPRequest{
    public newItem = (siteURL: string, listName: string, newItemBody: string): Promise<XMLHttpRequest> => {        
        var reactHandler = this;
        var request = new XMLHttpRequest();
        return new Promise((resolve, reject) => {
            reactHandler.getContext(siteURL).then((response) => {
                var formDigestValue = JSON.parse(response.responseText).FormDigestValue;                
                request.open('POST', siteURL + "/_api/web/lists/getbytitle('"+listName+"')/items", true); 
                request.setRequestHeader("Accept","application/json;odata=verbose");
                request.setRequestHeader("X-RequestDigest",formDigestValue);
                request.setRequestHeader("Content-Type","application/json;odata=verbose");
                request.onreadystatechange = () =>{                    
                    if (request.readyState !== 4) return;
                    if (request.status >= 200 && request.status < 300){                   
                        console.log("Item created.");
                        resolve(request);                    
                    } 
                    else { 
                        reject(null);
                        console.log('Error creating item.');
                        console.log(request.status);   
                        console.log(request.statusText);
                        console.log(listName);              
                    } 
                };    
                request.send(newItemBody);
            }).catch((error) => {
                console.log("Failed getting form digest. New Item.");
                console.log(error.status);
                console.log(error.statusText);
            });
        });
    }

    public getContext = (siteURL: string): Promise<XMLHttpRequest> => {
        var request = new XMLHttpRequest();
        return new Promise((resolve, reject) => {
            request.onreadystatechange = () => {              
                if (request.readyState !== 4) return;
                if (request.status >= 200 && request.status < 300) {                    
                    resolve(request);
                } else {                    
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                }    
            };
            request.open('POST', siteURL + "/_api/contextinfo", true);
            request.setRequestHeader("Accept","application/json");            
            request.send();
        });        
    }

    public getSPData = (siteURL: string, apiString: string): Promise<XMLHttpRequest> => {
        var request = new XMLHttpRequest();
        return new Promise((resolve, reject) => {                      
            request.onreadystatechange = () => {              
                if (request.readyState !== 4) return;
                if (request.status >= 200 && request.status < 300) {
                    resolve(request);
                } else {                    
                    reject(null);
                    console.log("Get SP Data request failed to " + apiString);                    
                    console.log(request.status);
                    console.log(request.statusText);                    
                }                 
            };
            request.open('GET', siteURL + apiString, true);
            request.setRequestHeader("Accept","application/json;odata=verbose");
            request.setRequestHeader("Content-Type","application/json;odata=verbose");
            request.send();
            
        });        
    }  
}

export default SPRequest;