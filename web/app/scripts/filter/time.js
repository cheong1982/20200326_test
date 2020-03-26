/**
 * Created by ksm on 2014-12-04.
 */

'use strict';

angular.module('intrcApp')
    .filter('time', function(){
        return function(input, format){
            if(input==null){return "";}
            if(input.indexOf(':') == -1){return input;}

            var input_split = input.split(":");

            // [ Make ] Hour
            var hour = '';
            if(input_split[0] != null){
                if(input_split[0].length == 1)  hour = '0'+input_split[0];
                else                            hour = input_split[0];
            }

            // [ Make ] Hour
            var min = '';
            if(input_split[1] != null){
                if(input_split[1].length == 1)  min = '0'+input_split[1];
                else                            min = input_split[1];
            }

            // [ Make ] Sec
            var sec = '';
            if(input_split[2] != null){
                if(input_split[2].length == 1)  sec = '0'+input_split[2];
                else                            sec = input_split[2];
            }

            // [ Check ] UpperCase
            var time_format = format.toUpperCase();

            var time = '';

            // [ Combine ] Result
            if(time_format.indexOf("HH") > -1){
                time += hour;
            }

            if(time_format.indexOf("MM") > -1){
                if(time == ""){
                    time += min;
                }else{
                    time += (":" + min);
                }
            }

            if(time_format.indexOf("SS") > -1){
                if(time == ""){
                    time += sec;
                }else{
                    time += (":" + sec);
                }
            }

            return time;
            //alert(input + " : " + format);
        };
    });
