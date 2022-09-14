import { async } from 'regenerator-runtime';
import { TIMEOUT } from './configuration.js';

/**
 * Setting setTimeout within the Promise reject method.
 * @param {string} seconds that is being stored in configuration module variable
 * @returns new Promise with only reject method with an error handler message
 */
const timeout = function (seconds) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(
        new Error(`Request took too long! Timeout after ${seconds} second`)
      );
    }, seconds * 1000);
  });
};
/**
 * Sending or getting the data to/from API depending on parameters.
 * @param {string} URL 
 * @param {Object} uploadingRecipe set to undefined by default >> if there is the data, it means function tends to send the data to the API.
 * @returns {Object} 
 */
export const AJAX = async function (URL, uploadingRecipe = undefined) {
  try {
    // Storing the data either ajax call sends or gets the API using ternary operator.
    const fetchPromise = uploadingRecipe
      ? fetch(URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadingRecipe),
        })
      : fetch(URL);

    /*
     * Response stores the Promise containing a fetched data or timeout rejection with its Error handler.
     * Whatever data is going to be stored depends on race() method taking two racing parameters *what comes first gets stored
     * Fetched data is returned as a Response object.
     * Its OK: property can either be set to false or true.
     */
    const response = await Promise.race([fetchPromise, timeout(TIMEOUT)]);
    /*
    Data stores returned json Object that either can contain data property with the fetched data or message property if any error occurs.
    */
    const data = await response.json();
    /*
    If an error occurs during fetching then new error is being thrown with a response status property and a content taken out of message property.
    */
    if (!response.ok) throw new Error(`${response.status}  ${data.message} `);
    // returns the *RESOLVED value stored in data variable
    return data;
  } catch (error) {
    throw error;
  }
};
