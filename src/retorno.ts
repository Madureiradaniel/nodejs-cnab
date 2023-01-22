import { makeLine, readYaml, readLine } from './utils'
import { CNAB_YAML_DIR } from './const'

/**
 * ARQUIVO RETORNO
 * @param {*} files
 * @param {*} cnabtype
 * @param {*} bankcode
 */
export const parseRemessaCnab = (
  files: any,
  cnabtype = 400,
  bankcode = '237',
  retorno: { split: (arg0: string) => void }
) => {
  try {
    const yamls: any = []
    const retornoLines: any = retorno.split('\n')
    let index = 0
    for (const key in files) {
      const value = files[key]
      if (value.indexOf('codigo') === 0) {
        continue
      }
      if (value.forEach) {
        value.forEach((v: any) => {
          const layout = readYaml(
            CNAB_YAML_DIR + `/cnab${cnabtype}/${bankcode}/retorno/${value}.yml`
          )
          yamls.push({
            layout,
            data: retornoLines[index]
          })
        })
      } else {
        const layout = readYaml(CNAB_YAML_DIR + `/cnab${cnabtype}/${bankcode}/retorno/${value}.yml`)
        yamls.push({
          layout,
          data: retornoLines[index]
        })
      }
      index++
    }

    const infos = yamls.map((i: any, index: any) => {
      const line = makeLine(i.layout, i.data)
      return line
    })

    return infos
  } catch (e) {
    console.error(`parseRemessaCnab: `, e)
  }
}

/**
 * GERAR ARQUIVO RETORO
 * @param {*} files
 * @param {*} cnabtype
 * @param {*} bankcode
 */
export const generateRetornoCnab = (files: any, cnabtype = 400, bankcode = '237') => {
  try {
    const yamls: any = []
    for (const key in files) {
      const value = files[key]
      if (value.forEach) {
        value.forEach((v: any) => {
          const layout = readYaml(CNAB_YAML_DIR + `/cnab${cnabtype}/${bankcode}/retorno/${key}.yml`)
          yamls.push({
            layout,
            data: v
          })
        })
      } else {
        const layout = readYaml(CNAB_YAML_DIR + `/cnab${cnabtype}/${bankcode}/retorno/${key}.yml`)
        yamls.push({
          layout,
          data: value
        })
      }
    }

    const infos = yamls.map((i: any, index: any) => {
      return readLine(i.layout, i.data)
    })

    const infosLine = infos.map((i: any) => {
      return i.line
    })

    const CNAB_EOL = '\r\n'
    const data = infosLine.join(CNAB_EOL)
    return data
  } catch (e) {
    console.error(`generateRemessaCnab`, e)
  }
}
