"use client"

import React, {useEffect, useRef, useState} from "react";
import styles from "./Overview.module.scss";
import {subscribe, useSnapshot} from "valtio";
import Api from "@/app/api/api";
import AiMarkdown from "@/components/AiMarkdown/AiMarkdown";
import DataService from "@/app/service/data-service";
import {clsx} from "clsx";
import Icon from "@/components/Icon/Icon";

export default function Overview () {
  function onFirstEnter() {
  }
  function onFirstEffect() {
  }

  const firstEnter = useRef<boolean>(true)
  if (firstEnter.current) {
    firstEnter.current = false
    onFirstEnter()
  }
  const firstEffect = useRef<boolean>(true)
  useEffect(() => {
    if (firstEffect.current) {
      firstEffect.current = false
      onFirstEffect()
    }
  }, [])

  const apiData = useSnapshot(Api.data)

  let showData = useSnapshot(DataService.filterData)

  const UNKNOWN = 'unknown'
  let createTime = UNKNOWN
  let lastTime = UNKNOWN
  if (showData.length > 0) {
    createTime = showData[0].time
    lastTime = showData[showData.length - 1].time
  }
  
  return (
    <div className={styles.Overview}>
      <h1>Overview information</h1>
      <span className={styles.info}><b>Session ID:</b> &nbsp; {apiData.sid.length > 0 ? apiData.sid : UNKNOWN}</span>
      <span className={styles.info}><b>Last ID:</b> &nbsp; {apiData.last}</span>
      <span className={styles.info}><b>Create Time:</b> &nbsp; {createTime}</span>
      <span className={styles.info}><b>Last Time:</b> &nbsp; {lastTime}</span>
      <h1>All Log</h1>
      <div className={styles.logs}>
        {
          showData.length === 0 && <div className={styles.empty}>
                <span>No Data.</span>
            </div>
        }
        {
          showData.map((item, index) => {
            return (
              <div key={index} className={styles.log}>
                <div className={styles.tags}>
                  <span className={clsx(styles.box, styles.border)}>ID: {item.id} </span>
                  <span className={styles.box}>{item.time.split(' ')[0]}</span>
                  <span className={styles.box}>{item.time.split(' ')[1]}</span>
                  {
                    item.important && <span className={clsx(styles.box, styles.important)}>
                      <Icon size='23px' className={styles.icon}>round_star_rate</Icon>
                      <span  className={styles.text}>IMPORTANT</span>
                    </span>
                  }
                  <span className={styles.space}></span>
                  {
                    item.type && <span className={clsx(styles.box, styles.border)} style={{
                      marginRight: 0,
                    }}>{item.type}</span>
                  }
                </div>
                <AiMarkdown>
                  {'```javascript\n' + item.code + '\n```'}
                </AiMarkdown>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
