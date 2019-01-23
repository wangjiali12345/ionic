import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GlobalData } from "./GlobalData";
import { Events } from '@ionic/angular';

@Injectable()
export class LocalStorage {
    startTime: Date;//更新时间;
    lastStartTime: Date;//上次更新时间;
    public isDBCreate: boolean = false;

    constructor(private storage: Storage,  private events: Events,private globaldata: GlobalData) {
        
    }
    get(key: string) {
        var self = this;
        var p = new Promise(function (resolve, reject) {
            self.storage.ready().then(() => {
                self.storage.get(key).then((val) => {
                    return resolve(val);
                }).catch(err => {
                    return reject(err);
                })
            }).catch(err => {
                return reject(err);
            });
        })
        return p;

    }
    set(key: string, value)
    {
        let strjson = JSON.stringify(value);
        this.storage.ready().then(() => {
            this.storage.set(key, strjson);
        })
    }
    remove(key: string) {
        this.storage.remove(key);
    }
    
}