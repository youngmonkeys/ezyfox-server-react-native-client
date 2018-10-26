//
//  ViewController.m
//  ezyfox-server-react-native-client
//
//  Created by Dung Ta Van on 10/25/18.
//  Copyright © 2018 Young Monkeys. All rights reserved.
//

#import "ViewController.h"
#include <React/RCTRootView.h>
#include "EzyHeaders.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
//    dispatch_sync(dispatch_get_main_queue(), ^(void) {
//        NSLog(@"on main thread!");
//    });
}


- (IBAction)TestClick:(id)sender {
    NSLog(@"High Score Button Pressed");
    NSURL *jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.bundle?platform=ios"];
    
    RCTRootView *rootView =
    [[RCTRootView alloc] initWithBundleURL: jsCodeLocation
                                moduleName: @"freechat-react-native"
                         initialProperties:
     @{
       @"scores" : @[
               @{
                   @"name" : @"Alex",
                   @"value": @"42"
                   },
               @{
                   @"name" : @"Joel",
                   @"value": @"10"
                   }
               ]
       }
                             launchOptions: nil];
    UIViewController *vc = [[UIViewController alloc] init];
    vc.view = rootView;
    [self presentViewController:vc animated:YES completion:nil];
}
@end
