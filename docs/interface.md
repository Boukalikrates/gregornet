## Serwer ##

Początkowo platformę sprzętową serwera stanowiła płytka Raspberry~Pi~2 Model~B. Później zostało n przeniesiony na komputer klasy PC z procesorem Intel~Core~2~Duo~CPU~E7500 wyposażonym w 4~GB pamięci RAM. Rolę dysku systemowego pełni pamięć flash o pojemności 32 GB, a dysk z danymi to dysk talerzowy o pojemności 1~TB. W przyszłości planowany jest zakup kilku większych dysków i~skonfigurowania macierzy RAID. 

Serwer jest usytuowany w jednym z pomieszczeń w domu, jest podłączony przewodowo do sieci LAN i pracuje przez 24~godziny na dobę z przerwami kilka razy w roku. Serwer ma ustawiony stały adres IP `10.0.0.30`.

Na serwerze zainstalowany jest system operacyjny Debian w~wersji 11. W celu aktualizacji oprogramowania i usuwania błędów możliwa jest komunikacja z nim poprzez protokół SSH, a także przenoszenie plików poprzez FTP. W razie potrzeby możliwa jest obsługa serwera za pomocą środowiska graficznego XFCE po podłączeniu monitora i klawiatury. 

Serwer wyposażony jest w oprogramowanie Apache w wersji 2.4.54 oraz Python w wersji 3.9.2. Biblioteka mod_wsgi umożliwia wykonywanie skryptów Pythona w odpowiedzi na żądania HTTP, obsługuje nagłówki protokołu i przechwytuje błędy po stronie serwera. 




## Klient ##


Aplikacja kliencka może być uruchomiona na dowolnej nowoczesnej przeglądarce internetowej w wersji z 2018 roku lub późniejszej. Należy zwrócić uwagę na to, żeby klient i serwer były w tej samej sieci lokalnej, gdyż serwer nie jest wystawiony do Internetu. Może być to fizyczna sieć przewodowa lub bezprzewodowa, bądź sieć wirtualna, np. przy użyciu oprogramowania Hamachi lub podobnego.


Interfejs użytkownika został zaprojektowany tak, żeby był lekki i działał nawet na starszych telefonach i komputerach, a jednocześnie wyglądem nie odstawał od nowoczesnych aplikacji. Zastosowano standard Material Design 2, który gwarantuje spójność w działaniu i wyglądzie wszystkich kontolek. Do jego implemaentacji została użyta biblioteka Material Design Lite. Charakteryzuje się ona szeroką kompatybilnością, stabilnością, łatwością w użyciu i nie wymaga żadnych frameworków. 

 
## Interfejs ##

Po wpisaniu adresu IP w przeglądarce internetowej ukazuje się użytkownikowi podstawowy interfejs aplikacji, który został przedstawiony na rysunku {}. Składa się on z paska tytułowego, paska narzędzi oraz obszaru głównego. 

Pasek tytułowy zawiera nazwę serwera lub, po przejściu do podfolderu, nazwę tego podfolderu. Obok znajdują się dwa przyciski. Przycisk oznaczony strzałką w górę służy otwieraniu okna dialogowego do przesyłania plików. Kliknięcie przycisku z kołem zębatym natomiast otwiera okno dialogowe z ustawieniami.

Pasek narzędzi posiada następujące narzędzia, patrząc od lewej:
* przycisk pozwalający zmienić widok na jeden z trzech opisanych poniżej,
* przycisk pozwalający wybrać kolor dla bieżącego folderu,
* przycisk pozwalający utworzyć nowy folder w bieżącym folderze,
* lista rozwijana pozwalająca wybrać metodę sortowania,
* przycisk umożliwiający odwrócenie kolejności sortowania.





## Widoki ##

W widoku domyślnym (Default view) każdy plik i folder reprezentowany jest przez kartę. Karty różnią się w zależności od typu pliku, jednak każda karta posiada stałe elementy. Są to: nazwa pliku, ikona oznaczająca typ pliku, oraz przycisk menu w prawym dolnym rogu. W przypadku kart dla obrazów i filmów wideo elementy te są widoczne dopiero po wskazaniu myszą. W przypadku używania ekranu dotykowego przycisk menu jest widoczny zawsze. Karty wyświetlanesą w rzędach. Liczba kart w rzędzie uzależniona jest od wielkości ekranu. Maksymalnie są to cztery karty.

Karta folderu zawiera ponadto liczbę plików w tym folderze, a także, jeżeli w folderze znajdują się obrazy, ich miniaturki.

Całą powierzchnię karty obrazu zajmuje miniatura obrazu. Aby miniatura była lepiej widoczna, nazwa i ikona są ukryte do momentu wskazania myszą.

Karta dla plików dźwiękowych zawiera w dolnej części dodatkowe przyciski: przycisk odtwarzania oraz przycisk pobierania pliku. Ponadto są wyświetlane dane dotyczące tytułu utworu, artysty i nazwy albumu, jeżeli są one zawarte w pliku.

Karta dla pliku wideo jest połączeniem dwóch poprzednich. Posiada ona miniaturkę na całej powierzchni oraz przyciski odtwarzania i pobierania. 

Karta pliku HTML posiada w środkowej części podgląd tego pliku.

Na pozostałych kartach podany jest rozmiar plików w naturalnych jednostkach.


Widok strumienia (Stream) inspirowany jest portalami społecznościowymi, w których użytkownik przewija niekończący się strumień złożony ze zdjęć. W tym widoku pliki niebędące multimediami są ukryte. Obrazy nie są wyświetlane w kartach, lecz są prezentowane w całości. Foldery, pliki dźwiękowe i wideo wyświetlane są identycznie jak w widoku domyślnym.

Widok listy (List view) zakłada czytelność danych. W tym widoku karty zredukowane są do ikony, nazwy pliku i przycisku menu. Nie są widoczne miniatury ani dodatkowe informacje. 

Widok wybierany jest dla danego folderu. Nie jest synchronizowany pomiędzy klientami. W przypadku niewybrania widoku, używany jest widok folderu nadrzędnego.


## Poruszanie się po strukturze folderów ##

Pod paskiem narzędzi, a nad listą plików znajduje się ścieżka bieżącego folderu w postaci przycisków, po jednym dla każdego folderu w hierarchi. 
Aby wejść do folderu podrzędnego, wystarczy kliknąć w dowolnym miejscu jego karty.  



## Wsparcie historii przeglądania ##

Aplikacja wspiera integrację z historią przeglądarki internetowej. Reaguje na komendy wydawane przyciskami Wstecz i Dalej, każdy folder jest odnotowywany w historii wyświetlania, można je równiesz dodawać do zakładek. Ponadto w pasku adresu jest wyświetlana bieżąca lokalizacja folderu. 


## Sortowanie ##

Po kliknięciu przycisku z rodzajem sortowania można wybrać jedną z pięciu metod sortowania: po nazwie pliku, po typie, po dacie modyfikacji, po rozmiarze i pseudolosowo. Sorttowanie pseudolosowe ma to do siebie, że pliki wyglądają na wyświetlone w przypadkowej kolejności, jednak ta kolejność jest zawsze taka sama. Kolejność można zmienić zmieniając ziarno w konfiguracji. Możliwe jest też ustawienie w konfiguracji zmienianie kolejności każdego dnia.

Kliknięcie przycisku z szewronem obok spowoduje odwrócenie kolejności sortowania.

Metoda sortowania jest zapisywana w pamięci przeglądarki. Jest dziedziczona, co oznacza, że podfoldery będą sortowane w ten sam sposób, chyba że zostanie wybrany inny sposób dla danego podfolderu.

## Paginacja, podział na strony ##

Dla folderów, których liczba plików przekracza określoną wartość, jest możliwy podział na strony. W takim przypadku na jednej stronie wyświetlana jest określona liczba plików. Przejście do pierwszej, poprzedniej, następnej lub ostatniej strony jest możliwe za pomocą dodatkowych przycisków wyświetlonych na pasku narzędzi. Pomiędzy nimi znajduje się przycisk z liczbą, po kliknięciu którego można wpisać numer strony, która ma zostać wyświetlona. Ponadto, poniżej wyświetlone są numery wszystkich dostępnych stron w sposób podobny jak ścieżka folderu. Ten zestaw przycisków (poza przyciskiem umożliwiającym wpisanie numeru) są powtórzone poniżej listy plików. 

Bieżąca strona jest zapamiętywana w pamięci przeglądarki dla każdego folderu, dzięki czemu można zacząć przeglądanie od miejsca, w którym zakończyło się je poprzednim razem.

Wielkość strony, tj. liczbę plików do wyświetlenia na jednej stronie, można zmienić w konfiguracji.

## Wybór koloru dla folderu ##

Foldery mogą być oznaczone kolorami, aby wyróżnić je wśród innych folderów. Do wyboru jest 19 kolorów z palety Material Design[https://m2.material.io/design/color/the-color-system.html#tools-for-picking-colors]. Wybrany kolor jest widoczny zarówno w karcie folderu, jak i w tle oraz niektórych elementach po wejściu do niego. Kolory folderów są synchronizowane pomiędzy klientami.

## Wyświetlanie plików tekstowych ##

Aplikacja domyślnie wyświetla pliki tekstowe o określonych nazwach (np. readme, license). Dekoduje formatowanie Markdown. Nazwy plików, jakie mają być wyświetlane, można ustawić w konfiguracji.

## Odtwarzacz multimedialny ##

Odtwarzacz multimedialny pozwala odtwarzać pliki dźwiękowe i wideo. Jego inicjalizacja następuje przy kliknięciu przycisku odtwarzania przy jednym z plików. Ma on postać paska w dolnej części ekranu, na którym umieszczone są kontrolki odwarzania, tytuł, oraz bieżący czas odtwarzania wraz z długością pliku. 

Na kontolki odtwarzania składają się przyciski pauza/wznów, stop, poprzedni plik, następny plik oraz suwak przewijania. Ich działanie jest standardowe, z wyjątkiem przycisku stop, którego użycie powoduje ukrycie odtwarzacza. Po lewej znajduje się dodatkowo przycisk pozwalający minimalizować odtwarzacz. Po jego kliknięciu wyświetlany jest tylko suwak przewijania oraz przycisk unoszący (FAB) umożliwiający przywrócenie odtwarzacza.

Pośrodku znajduje się miejsce na tytuł odtwarzanego utworu wraz z nazwą wykonawcy. Informacje te są pobierane z metadanych utworu. Jeżeli plik nie posiada takich informacji, w tym miejscu wyświetlana jest nazwa pliku. 

W przypadku wybrania pliku wideo całą powierzchnię aplikacji zajmuje obraz wideo. Po zminimalizowaniu zajmuje on niewielki prostokąt w lewym dolnym rogu.

Sterowanie odtwarzaczem możliwe jest również za pomocą przycisków multimedialnych na klawiaturze oraz kontrolek udostępnionych przez system operacyjny. Ich wygląd różni się w zależności od systemu, na którym uruchomiony jest klient. Przykłady przedstawiono na rysunku {}.


## Ustawienia ##

Po kliknięciu przycisku ustawień wyświetla się okno ustawień. Zawiera ono trzy karty: ustawienia lokalne, ustawienia serwerowe oraz informacje.

Z ustawień lokalnych można wybrać motyw aplikacji. Dostępny jest motyw jasny (light) i ciemny (dark). Można też zostawić pocję domyślną aby motyw był zgodny z motyweem sustemu operacyjnego.

Z tej samej karty można też wybrać sposób odtwarzania multimediów. Dostępne są następujące opcje:
* Domyślny (Default) – po zakończeniu odtwarzania jednego pliku zostanie odtworzony następny, aż do końca folderu;
* W pętli (Loop) – podobnie jak Domyślny, przy czym po ostatnim pliku w folderze zostanie dotworzony pierwszy na liście;
* Pojedyńczy plik (Single track) – po zakończeniu odtwarzania wybranego pliku nastąpi zatrzymanie odtwarzania;
* Pojedyńczy plik w pętli (Loop single track) – po zakończeniu odtwarzania pliku zostanie on odtworzony od początku, w nieskończoność.

