/**
 * 反转一个整数，支持负数
 */
const reverseInteger = function(number) {
  var str = String(number)
  if(str.length > 9) return 0
  if(str.charAt(0) == '-') {
    var str_r = String(number).substr(1, str.length)
    return parseInt('-' + str.split('').reverse().join(''))
  }
  return ParseInt(str.split('').reverse().join(''))
}
reverseInteger(-123)

/**
 * 实现阶乘（递归）
 */
function factorialize(num) {
  if(num < 0) {
    return -1
  }else if(num === 0 || num === 1) {
    return 1
  }else {
    return (num * factorialize(num - 1))
  }
}
factorialize(10)

/**
 * 回文 - 正念反念都一样
 */
function palindrome(str) {
  var new_str = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().split('')
  return new_str.join('') === new_str.reverse().join('') ? true : false
}
palindrome("never odd or even")

/**
 * 找出最长单词
*/
function findLongestWord(str) {
  var new_str = str.split(' ')
  var arr = []
  for(var i = 0; i < new_str.length; i++) {
    arr.push(new_str[i].length)
  }
  return arr.sort((a, b) => {
    return b - a
  })[0]
}
findLongestWord('The quick brown fox jumped over the lazy dog')

/**
 * string里的每个单词首字符大写
 */
function titleCase(str) {
  return str.toLowerCase().split(' ').map(item => {
    return item.replace(item.charAt(0), item[0].toUpperCase())
  }).join(' ')
}
titleCase("I'm a little tea pot")

/** 我渴望学习是为了认知自我，不是为了教育他人；我一直认为教导别人之前必须了解自己  ----卢俊 */

