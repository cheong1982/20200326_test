/**
 * Created by ksm on 2015-04-20.
 */

'use strict';

angular.module('intrcApp')
    .constant('COM', {
        setting: {
            method_case:{
                statuses: [
                    {value: 1, text: 'Summary'},
                    {value: 2, text: 'Detail'}
                ]
            },
            int_active:{
                statuses: [
                    {value: 0, text: 'OFF'},
                    {value: 1, text: 'ON'}
                ]
            },
            active:{
                statuses: [
                    {value: false, text: 'OFF'},
                    {value: true, text: 'ON'}
                ]
            },
            date_fmt: {
                statuses: [
                    {value: 0, text: "YYYY/MM/DD"},
                    {value: 1, text: "MM/DD/YYYY"},
                    {value: 2, text: "DD/MM/YYYY"}
                ]
            },
            time_fmt: {
                statuses: [
                    {value: 0, text: "hh:mm:ss"}
                ]
            },
            time_zone: {
                statuses: [
                    {value: 1, data: -((60*60*12)*1000), simple_text: 'UTC-12', text: 'UTC-12 (BIT)'},
                    {value: 2, data: -((60*60*11)*1000), simple_text: 'UTC-11', text: 'UTC-11 (NUT, SST)'},
                    {value: 3, data: -((60*60*10)*1000), simple_text: 'UTC-10',  text: 'UTC-10 (CKT, HAST, HST, TAHT)'},
                    {value: 4, data: -(((60*60*9) + (60*30))*1000), simple_text: 'UTC-09:30',  text: 'UTC-09:30 (MART, MIT)'},
                    {value: 5, data: -((60*60*9)*1000), simple_text: 'UTC-09',  text: 'UTC-09 (AKST, GAMT, GIT, HADT)'},
                    {value: 6, data: -((60*60*8)*1000), simple_text: 'UTC-08',  text: 'UTC-08 (AKDT, CIST, PST)'},
                    {value: 7, data: -((60*60*7)*1000), simple_text: 'UTC-07',  text: 'UTC-07 (MST, PDT)'},
                    {value: 8, data: -((60*60*6)*1000), simple_text: 'UTC-06',  text: 'UTC-06 (CST, EAST, GALT, MDT)'},
                    {value: 9, data: -((60*60*5)*1000), simple_text: 'UTC-05',  text: 'UTC-05 (CDT, COT, CST, EASST, ECT, EST, PET)'},
                    {value: 10, data: -(((60*60*4) + (60*30))*1000), simple_text: 'UTC-04:30',  text: 'UTC-04:30 (VET)'},
                    {value: 11, data: -((60*60*4)*1000), simple_text: 'UTC-04',  text: 'UTC-04 (AMT, AST, BOT, CDT, CLT, COST, ECT, EDT, FKT, GYT, PYT)'},
                    {value: 12, data: -(((60*60*3) + (60*30))*1000), simple_text: 'UTC-03:30',  text: 'UTC-03:30 (NST, NT)'},
                    {value: 13, data: -((60*60*3)*1000), simple_text: 'UTC-03',  text: 'UTC-03 (ADT, AMST, ART, BRT, CLST, FKST, GFT, PMST, PYST, ROTT, SRT, UYT)'},
                    {value: 14, data: -(((60*60*2) + (60*30))*1000), simple_text: 'UTC-02:30',  text: 'UTC-02:30 (NDT)'},
                    {value: 15, data: -((60*60*2)*1000), simple_text: 'UTC-02',  text: 'UTC-02 (FNT, GST, PMDT, UYST)'},
                    {value: 16, data: -((60*60*1)*1000), simple_text: 'UTC-01',  text: 'UTC-01 (AZOST, CVT, EGT)'},
                    {value: 17, data: ((60*60*0)*1000), simple_text: 'UTC',  text: 'UTC (GMT, UCT, WET, Z, EGST)'},
                    {value: 18, data: ((60*60*1)*1000), simple_text: 'UTC+01',  text: 'UTC+01 (BST, CET, DFT, IST, MET, WAT, WEDT, WEST)'},
                    {value: 19, data: ((60*60*2)*1000), simple_text: 'UTC+02',  text: 'UTC+02 (CAT, CEDT, CEST, EET, HAEC, IST, MEST, SAST, WAST)'},
                    {value: 20, data: ((60*60*3)*1000), simple_text: 'UTC+03',  text: 'UTC+03 (AST, EAT, EEDT, EEST, FET, IDT, IOT, SYOT)'},
                    {value: 21, data: ((60*60*3) + (60*30)*1000), simple_text: 'UTC+03:30',  text: 'UTC+03:30 (IRST)'},
                    {value: 22, data: ((60*60*4)*1000), simple_text: 'UTC+04',  text: 'UTC+04 (AMT, AZT, GET, GST, MSK, MUT, RET, SAMT, SCT, VOLT)'},
                    {value: 23, data: ((60*60*4) + (60*30)*1000), simple_text: 'UTC+04:30',  text: 'UTC+04:30 (AFT, IRDT)'},
                    {value: 24, data: ((60*60*5)*1000), simple_text: 'UTC+05',  text: 'UTC+05 (AMST, HMT, MAWT, MVT, ORAT, PKT, TFT, TJT, TMT, UZT)'},
                    {value: 25, data: ((60*60*5) + (60*30)*1000), simple_text: 'UTC+05:30',  text: 'UTC+05:30 (IST, SLST)'},
                    {value: 26, data: ((60*60*5) + (60*45)*1000), simple_text: 'UTC+05:45',  text: 'UTC+05:45 (NPT)'},
                    {value: 27, data: ((60*60*6)*1000), simple_text: 'UTC+06:00',  text: 'UTC+06:00 (BIOT, BST, BTT, KGT, VOST, YEKT)'},
                    {value: 28, data: ((60*60*6) + (60*30)*1000), simple_text: 'UTC+06:30',  text: 'UTC+06:30 (CCT, MMT, MST)'},
                    {value: 29, data: ((60*60*7)*1000), simple_text: 'UTC+07',  text: 'UTC+07 (CXT, DAVT, HOVT, ICT, KRAT, OMST, THA, WIT)'},
                    {value: 30, data: ((60*60*8)*1000), simple_text: 'UTC+08',  text: 'UTC+08 (ACT, AWST, BDT, CHOT, CIT, CST, CT, HKT, MST, MYT, PST, SGT, SST, ULAT, WST)'},
                    {value: 31, data: ((60*60*8) + (60*45)*1000), simple_text: 'UTC+08:45',  text: 'UTC+08:45 (CWST)'},
                    {value: 32, data: ((60*60*9)*1000), simple_text: 'UTC+09',  text: 'UTC+09 (AWDT, EIT, IRKT, JST, KST, TLT)'},
                    {value: 33, data: ((60*60*9) + (60*30)*1000), simple_text: 'UTC+09:30',  text: 'UTC+09:30 (ACST, CST)'},
                    {value: 34, data: ((60*60*10)*1000), simple_text: 'UTC+10',  text: 'UTC+10 (AEST, CHST, CHUT, DDUT, EST, PGT, VLAT, YAKT)'},
                    {value: 35, data: ((60*60*10) + (60*30)*1000), simple_text: 'UTC+10:30',  text: 'UTC+10:30 (ACDT, CST, LHST)'},
                    {value: 36, data: ((60*60*11)*1000), simple_text: 'UTC+11',  text: 'UTC+11 (AEDT, KOST, LHST, MIST, NCT, PONT, SAKT, SBT)'},
                    {value: 37, data: ((60*60*11) + (60*30)*1000), simple_text: 'UTC+11:30',  text: 'UTC+11:30 (NFT)'},
                    {value: 38, data: ((60*60*12)*1000), simple_text: 'UTC+12',  text: 'UTC+12 (FJT, GILT, MAGT, MHT, NZST, PETT, TVT, WAKT)'},
                    {value: 39, data: ((60*60*12) + (60*45)*1000), simple_text: 'UTC+12:45',  text: 'UTC+12:45 (CHAST)'},
                    {value: 40, data: ((60*60*13)*1000), simple_text: 'UTC+13',  text: 'UTC+13 (NZDT, PHOT, TKT, TOT)'},
                    {value: 41, data: ((60*60*13) + (60*45)*1000), simple_text: 'UTC+13:45',  text: 'UTC+13:45 (CHADT)'},
                    {value: 42, data: ((60*60*14)*1000), simple_text: 'UTC+14',  text: 'UTC+14 (LINT)'}
                ]
            },
            what_key:{
                name:'Key Setting',
                field:'what_key',
                statuses: [
                    {value: 'ALIAS', text: 'MediaPlayer Name'},
                    {value: 'IP', text: 'IP Address'},
                    {value: 'MAC', text: 'MAC Address'}
                ]
            },
            auth: {
                statuses: [
                    {value: 1, text: 'Modify Information'},    //Device Information
                    {value: 2, text: 'MediaPlayer Control'},   //MediaPlayer
                    {value: 4, text: 'Display Control'},        //Display
                    {value: 8, text: 'View Report'},            //Report
                    {value: 16, text: 'Administration'}             //Report
                ]
            },
            predict:{
                category:{
                    statuses: [
                        {value: 1, text: 'Down'},
                        {value: 2, text: 'Temperature'},
                        {value: 3, text: 'Check up'},
                        {value: 4, text: 'ETC'}
                    ]
                },
                active:{
                    statuses: [
                        {value: 0, text: 'OFF'},
                        {value: 1, text: 'ON'}
                    ]
                },
                th_device:{
                    statuses: [
                        {value: 1, text: 'MediaPlayer\'s CPU Usage', unit: "%"},
                        {value: 2, text: 'MediaPlayer\'s CPU Temperature', unit: "℃"},
                        {value: 3, text: 'MediaPlayer\'s Disk Usage', unit: "%"},
                        {value: 4, text: 'MediaPlayer\'s Disk Temperature', unit: "℃"},
                        {value: 5, text: 'MediaPlayer\'s Memory Usage', unit: "%"},
                        {value: 6, text: 'MediaPlayer\'s Memory Temperature', unit: "℃"},
                        {value: 7, text: 'MediaPlayer\'s Network Response Time'},
                        {value: 8, text: 'MediaPlayer\'s Fan Speed', unit: "rpm"},
                        {value: 9, text: 'Display\'s Temperature', unit: "℃"},
                        {value: 10, text: 'Display\'s Lamp'},
                        {value: 11, text: 'Display\'s Input Signal'}
                    ]
                },
                th_compare:{
                    statuses: [
                        {value: 1, text: '>'},
                        {value: 2, text: '<'},
                        {value: 3, text: '='},
                        {value: 4, text: '>='},
                        {value: 5, text: '<='}
                    ]
                },
                co_string:{
                    statuses: [
                        {value: 0, text: 'Empty'},
                        {value: 1, text: 'AND'},
                        {value: 2, text: 'OR'}
                    ]
                }
            }
        }
    });