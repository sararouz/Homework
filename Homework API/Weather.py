# creat difrent latitude
from citipy import citipy
import numpy as np
import matplotlib.pyplot as plt
import requests, time, csv
# from sets import Set

LonList=np.linspace(-180,180,20)
LatList=np.linspace(-90,90,1000)
CityCountry=[]
weatherList = []
Lat = []
temp = []
humid = []
cloud=[]
windSpeed=[]
#find cities


with open('weatherReport.csv', 'w') as csvfile:
    dataWriter = csv.writer(csvfile, delimiter=',')
    dataWriter.writerow(['City','Country','Latitude','Longitude','Temperature','Humidity','Cloudiness','WindSpeed','URL'])
    cityCounter = 0
    for lat in LatList:
        for lon in LonList:
            city = citipy.nearest_city(lat,lon)
            City=city.city_name
            Country=city.country_code
            CityCountrySTR= "{0},{1}".format(City,Country)
            if CityCountrySTR not in CityCountry:
                CityCountry.append(CityCountrySTR)
                URL="http://api.openweathermap.org/data/2.5/weather?q={0}&appid=4cc2a844092656dedc2d4db74f22bdb6".format(CityCountrySTR)
                # print(CityCountrySTR)
                r = requests.get(URL)
                data = r.json()
                if data['cod']==200:
                    weatherList.append(data)
                    Lat.append(data['coord']['lat'])
                    temp.append(data['main']['temp']*(9/5) - 459.67) #Kelvin to Fahrenheit
                    humid.append(data['main']['humidity'])
                    cloud.append(data['clouds']['all'])
                    windSpeed.append(data['wind']['speed'])
                    dataWriter.writerow([City,Country,data['coord']['lat'],data['coord']['lon'],temp[-1],humid[-1],cloud[-1],windSpeed[-1],URL])
                    cityCounter += 1
                    print("Processing Rcord {0} | {1} \n {2}".format(cityCounter,City,URL))
                break
# print(len(weatherList))
plt.plot(Lat,temp,'o')
plt.title('Temperature (F) vs. Latitude\n{0}'.format(time.ctime()))
plt.xlabel('Latitude')
plt.ylabel('Temperature (F)')
# plt.show()
plt.savefig('Lat_vs_Temp')
plt.clf()

plt.plot(Lat,humid,'o')
plt.title('Humidity (%) vs. Latitude\n{0}'.format(time.ctime()))
plt.xlabel('Latitude')
plt.ylabel('Humidity (%)')
# plt.show()
plt.savefig('Lat_vs_Humidity')
plt.clf()

plt.plot(Lat,cloud,'o')
plt.title('Cloudiness (%) vs. Latitude\n{0}'.format(time.ctime()))
plt.xlabel('Latitude')
plt.ylabel('Cloudiness (%)')
# plt.show()
plt.savefig('Lat_vs_Cloudiness')
plt.clf()

plt.plot(Lat,windSpeed,'o')
plt.title('Wind Speed (mph) vs. Latitude\n{0}'.format(time.ctime()))
plt.xlabel('Latitude')
plt.ylabel('Wind Speed (mph)')
# plt.show()
plt.savefig('Lat_vs_Wind-Speed')
plt.clf()

# print(len(list(set(CityCountry))))
# print(len(CityCountry))




#
